from __future__ import annotations

import json
from typing import Callable

import paho.mqtt.client as mqtt

from .config import Settings
from .models import ValidationError, parse_telemetry
from .storage import TelemetryStore


class MqttIngestor:
    def __init__(self, settings: Settings, store: TelemetryStore) -> None:
        self._settings = settings
        self._store = store
        self._client = mqtt.Client()
        if settings.mqtt_username:
            self._client.username_pw_set(settings.mqtt_username, settings.mqtt_password)
        self._client.on_connect = self._on_connect
        self._client.on_message = self._on_message
        self._on_error: Callable[[str], None] | None = None

    def set_error_handler(self, handler: Callable[[str], None]) -> None:
        self._on_error = handler

    def start(self) -> None:
        self._client.connect(self._settings.mqtt_host, self._settings.mqtt_port, 60)
        self._client.loop_start()

    def stop(self) -> None:
        self._client.loop_stop()
        self._client.disconnect()

    def _on_connect(self, client: mqtt.Client, userdata: object, flags: dict, rc: int) -> None:
        del client, userdata, flags
        if rc == 0:
            self._client.subscribe(self._settings.mqtt_telemetry_topic)
        else:
            self._emit_error(f"MQTT connect failed: {rc}")

    def _on_message(self, client: mqtt.Client, userdata: object, msg: mqtt.MQTTMessage) -> None:
        del client, userdata
        try:
            payload = json.loads(msg.payload.decode("utf-8"))
            telemetry = parse_telemetry(payload)
            self._store.save_payload(telemetry)
        except (json.JSONDecodeError, ValidationError) as exc:
            self._emit_error(f"Invalid telemetry payload: {exc}")
        except Exception as exc:  # noqa: BLE001
            self._emit_error(f"Telemetry ingest failed: {exc}")

    def _emit_error(self, message: str) -> None:
        if self._on_error:
            self._on_error(message)
