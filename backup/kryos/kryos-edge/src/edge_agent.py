from __future__ import annotations

import json
import random
import time
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

from .config import EdgeSettings


class EdgeAgent:
    def __init__(self, settings: EdgeSettings) -> None:
        self._settings = settings
        self._client = mqtt.Client()
        if settings.mqtt_username:
            self._client.username_pw_set(settings.mqtt_username, settings.mqtt_password)
        self._client.on_message = self._on_message
        self._client.on_connect = self._on_connect

    def start(self) -> None:
        self._client.connect(self._settings.mqtt_host, self._settings.mqtt_port, 60)
        self._client.loop_start()

    def stop(self) -> None:
        self._client.loop_stop()
        self._client.disconnect()

    def run(self) -> None:
        self.start()
        try:
            while True:
                payload = self._build_telemetry()
                self._client.publish(
                    self._settings.telemetry_topic, json.dumps(payload), qos=1
                )
                time.sleep(2)
        except KeyboardInterrupt:
            self.stop()

    def _on_connect(self, client: mqtt.Client, userdata: object, flags: dict, rc: int) -> None:
        del client, userdata, flags
        if rc == 0:
            self._client.subscribe(self._settings.command_topic)

    def _on_message(self, client: mqtt.Client, userdata: object, msg: mqtt.MQTTMessage) -> None:
        del client, userdata
        try:
            payload = json.loads(msg.payload.decode("utf-8"))
        except json.JSONDecodeError:
            return
        ack = {
            "version": payload.get("version", "v1.0"),
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "company_id": payload.get("company_id", self._settings.company_id),
            "plant_id": payload.get("plant_id", self._settings.plant_id),
            "device_id": payload.get("device_id", self._settings.device_id),
            "agent_id": payload.get("agent_id", self._settings.agent_id),
            "command_id": payload.get("command_id", "unknown"),
            "status": "applied",
            "message": None,
        }
        ack_topic = f"kryos/v1/{self._settings.company_id}/{self._settings.plant_id}/{self._settings.device_id}/status"
        self._client.publish(ack_topic, json.dumps(ack), qos=1)

    def _build_telemetry(self) -> dict[str, object]:
        temperature = round(4 + random.random() * 4, 2)
        pressure = round(10 + random.random() * 3, 2)
        return {
            "version": "v1.0",
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "company_id": self._settings.company_id,
            "plant_id": self._settings.plant_id,
            "device_id": self._settings.device_id,
            "agent_id": self._settings.agent_id,
            "metrics": [
                {
                    "variable_id": "var_temp",
                    "name": "COND.TEMP",
                    "value": temperature,
                    "unit": "C",
                    "quality": "good",
                    "status": "ok",
                },
                {
                    "variable_id": "var_press",
                    "name": "EVAP.PRESS",
                    "value": pressure,
                    "unit": "bar",
                    "quality": "good",
                    "status": "ok",
                },
            ],
        }


if __name__ == "__main__":
    EdgeAgent(EdgeSettings.from_env()).run()
