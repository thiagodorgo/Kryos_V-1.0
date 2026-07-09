from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse
import paho.mqtt.client as mqtt

from .config import Settings
from .models import CommandAck, ValidationError, parse_command
from .mqtt_ingest import MqttIngestor
from .storage import TelemetryStore

settings = Settings.from_env()
store = TelemetryStore(settings)
app = FastAPI(title="Kryos Backend MVP", version="0.1.0")

mqtt_client = mqtt.Client()
if settings.mqtt_username:
    mqtt_client.username_pw_set(settings.mqtt_username, settings.mqtt_password)


ingestor = MqttIngestor(settings, store)

def _log_error(message: str) -> None:
    print(message)


ingestor.set_error_handler(_log_error)


@app.on_event("startup")
async def startup_event() -> None:
    mqtt_client.connect(settings.mqtt_host, settings.mqtt_port, 60)
    mqtt_client.loop_start()
    ingestor.start()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    ingestor.stop()
    mqtt_client.loop_stop()
    mqtt_client.disconnect()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/telemetry/latest")
async def telemetry_latest(device_id: str) -> JSONResponse:
    rows = store.latest_by_device(device_id)
    return JSONResponse(
        [
            {
                "company_id": row.company_id,
                "plant_id": row.plant_id,
                "device_id": row.device_id,
                "agent_id": row.agent_id,
                "variable_id": row.variable_id,
                "name": row.name,
                "value": row.value,
                "unit": row.unit,
                "quality": row.quality,
                "status": row.status,
                "captured_at": row.captured_at,
            }
            for row in rows
        ]
    )


@app.post("/auth/login")
async def login(payload: dict[str, Any]) -> JSONResponse:
    email = payload.get("email")
    password = payload.get("password")
    if not isinstance(email, str) or not isinstance(password, str):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return JSONResponse(
        {
            "access_token": settings.api_token,
            "token_type": "Bearer",
            "expires_in": 3600,
            "user_id": "user_123",
            "role": "supervisor",
        }
    )


@app.post("/setpoints")
async def create_setpoint(
    payload: dict[str, Any], authorization: str | None = Header(default=None)
) -> JSONResponse:
    if authorization != f"Bearer {settings.api_token}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        command = parse_command(payload)
    except ValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    topic = settings.mqtt_command_topic.format(
        company=command.company_id,
        plant=command.plant_id,
        device=command.device_id,
    )
    mqtt_client.publish(topic, json.dumps(payload), qos=1)
    ack = CommandAck(
        version=command.version,
        timestamp=datetime.now(timezone.utc),
        company_id=command.company_id,
        plant_id=command.plant_id,
        device_id=command.device_id,
        agent_id=command.agent_id,
        command_id=command.command_id,
        status="submitted",
        message=None,
    )
    return JSONResponse(
        {
            "version": ack.version,
            "timestamp": ack.timestamp.isoformat().replace("+00:00", "Z"),
            "company_id": ack.company_id,
            "plant_id": ack.plant_id,
            "device_id": ack.device_id,
            "agent_id": ack.agent_id,
            "command_id": ack.command_id,
            "status": ack.status,
            "message": ack.message,
        }
    )
