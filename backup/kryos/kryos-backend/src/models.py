from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class TelemetryMetric:
    variable_id: str
    name: str
    value: float
    unit: str
    quality: str
    status: str


@dataclass(frozen=True)
class TelemetryPayload:
    version: str
    timestamp: datetime
    company_id: str
    plant_id: str
    device_id: str
    agent_id: str
    metrics: list[TelemetryMetric]


@dataclass(frozen=True)
class CommandPayload:
    version: str
    timestamp: datetime
    company_id: str
    plant_id: str
    device_id: str
    agent_id: str
    command_id: str
    variable_id: str
    name: str
    value: float
    unit: str
    requested_by: str
    reason: str | None


@dataclass(frozen=True)
class CommandAck:
    version: str
    timestamp: datetime
    company_id: str
    plant_id: str
    device_id: str
    agent_id: str
    command_id: str
    status: str
    message: str | None


class ValidationError(ValueError):
    pass


def _require_string(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value:
        raise ValidationError(f"{field} must be a non-empty string")
    return value


def _require_number(value: Any, field: str) -> float:
    if not isinstance(value, (int, float)):
        raise ValidationError(f"{field} must be a number")
    if value != value or value in (float("inf"), float("-inf")):
        raise ValidationError(f"{field} must be finite")
    return float(value)


def _require_timestamp(value: Any, field: str) -> datetime:
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be ISO 8601 string")
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValidationError(f"{field} must be ISO 8601 UTC") from exc


def parse_telemetry(payload: dict[str, Any]) -> TelemetryPayload:
    version = _require_string(payload.get("version"), "version")
    timestamp = _require_timestamp(payload.get("timestamp"), "timestamp")
    company_id = _require_string(payload.get("company_id"), "company_id")
    plant_id = _require_string(payload.get("plant_id"), "plant_id")
    device_id = _require_string(payload.get("device_id"), "device_id")
    agent_id = _require_string(payload.get("agent_id"), "agent_id")
    metrics_value = payload.get("metrics")
    if not isinstance(metrics_value, list) or not metrics_value:
        raise ValidationError("metrics must be a non-empty list")
    metrics: list[TelemetryMetric] = []
    for item in metrics_value:
        if not isinstance(item, dict):
            raise ValidationError("metrics items must be objects")
        metrics.append(
            TelemetryMetric(
                variable_id=_require_string(item.get("variable_id"), "variable_id"),
                name=_require_string(item.get("name"), "name"),
                value=_require_number(item.get("value"), "value"),
                unit=_require_string(item.get("unit"), "unit"),
                quality=_require_string(item.get("quality"), "quality"),
                status=_require_string(item.get("status"), "status"),
            )
        )
    return TelemetryPayload(
        version=version,
        timestamp=timestamp,
        company_id=company_id,
        plant_id=plant_id,
        device_id=device_id,
        agent_id=agent_id,
        metrics=metrics,
    )


def parse_command(payload: dict[str, Any]) -> CommandPayload:
    return CommandPayload(
        version=_require_string(payload.get("version"), "version"),
        timestamp=_require_timestamp(payload.get("timestamp"), "timestamp"),
        company_id=_require_string(payload.get("company_id"), "company_id"),
        plant_id=_require_string(payload.get("plant_id"), "plant_id"),
        device_id=_require_string(payload.get("device_id"), "device_id"),
        agent_id=_require_string(payload.get("agent_id"), "agent_id"),
        command_id=_require_string(payload.get("command_id"), "command_id"),
        variable_id=_require_string(payload.get("variable_id"), "variable_id"),
        name=_require_string(payload.get("name"), "name"),
        value=_require_number(payload.get("value"), "value"),
        unit=_require_string(payload.get("unit"), "unit"),
        requested_by=_require_string(payload.get("requested_by"), "requested_by"),
        reason=payload.get("reason"),
    )
