from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import mysql.connector

from .config import Settings
from .models import TelemetryMetric, TelemetryPayload


@dataclass
class TelemetryRow:
    company_id: str
    plant_id: str
    device_id: str
    agent_id: str
    variable_id: str
    name: str
    value: float
    unit: str
    quality: str
    status: str
    captured_at: str


class TelemetryStore:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._ensure_schema()

    def _connect(self):
        return mysql.connector.connect(
            host=self._settings.mysql_host,
            port=self._settings.mysql_port,
            user=self._settings.mysql_user,
            password=self._settings.mysql_password,
            database=self._settings.mysql_database,
        )

    def _ensure_schema(self) -> None:
        connection = self._connect()
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS telemetry (
                telemetry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                company_id VARCHAR(64) NOT NULL,
                plant_id VARCHAR(64) NOT NULL,
                device_id VARCHAR(128) NOT NULL,
                agent_id VARCHAR(64) NOT NULL,
                variable_id VARCHAR(128) NOT NULL,
                name VARCHAR(128) NOT NULL,
                value DOUBLE NOT NULL,
                unit VARCHAR(32) NOT NULL,
                quality VARCHAR(32) NOT NULL,
                status VARCHAR(32) NOT NULL,
                captured_at DATETIME NOT NULL
            )
            """
        )
        connection.commit()
        cursor.close()
        connection.close()

    def save_payload(self, payload: TelemetryPayload) -> None:
        rows = [
            TelemetryRow(
                company_id=payload.company_id,
                plant_id=payload.plant_id,
                device_id=payload.device_id,
                agent_id=payload.agent_id,
                variable_id=metric.variable_id,
                name=metric.name,
                value=metric.value,
                unit=metric.unit,
                quality=metric.quality,
                status=metric.status,
                captured_at=payload.timestamp.isoformat(sep=" ", timespec="seconds"),
            )
            for metric in payload.metrics
        ]
        self._insert_rows(rows)

    def latest_by_device(self, device_id: str) -> list[TelemetryRow]:
        connection = self._connect()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT company_id, plant_id, device_id, agent_id,
                   variable_id, name, value, unit, quality, status, captured_at
            FROM telemetry
            WHERE device_id = %s
            ORDER BY captured_at DESC
            LIMIT 20
            """,
            (device_id,),
        )
        rows = [TelemetryRow(**row) for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return rows

    def _insert_rows(self, rows: Iterable[TelemetryRow]) -> None:
        connection = self._connect()
        cursor = connection.cursor()
        cursor.executemany(
            """
            INSERT INTO telemetry (
                company_id, plant_id, device_id, agent_id,
                variable_id, name, value, unit, quality, status, captured_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            [
                (
                    row.company_id,
                    row.plant_id,
                    row.device_id,
                    row.agent_id,
                    row.variable_id,
                    row.name,
                    row.value,
                    row.unit,
                    row.quality,
                    row.status,
                    row.captured_at,
                )
                for row in rows
            ],
        )
        connection.commit()
        cursor.close()
        connection.close()
