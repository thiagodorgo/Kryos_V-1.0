from dataclasses import dataclass
import os


@dataclass(frozen=True)
class EdgeSettings:
    mqtt_host: str
    mqtt_port: int
    mqtt_username: str | None
    mqtt_password: str | None
    company_id: str
    plant_id: str
    device_id: str
    agent_id: str
    telemetry_topic: str
    command_topic: str

    @staticmethod
    def from_env() -> "EdgeSettings":
        company = os.getenv("KRYOS_COMPANY_ID", "cmp_001")
        plant = os.getenv("KRYOS_PLANT_ID", "plt_001")
        device = os.getenv("KRYOS_DEVICE_ID", "PLT01-UTIL-CHILLER-02")
        agent = os.getenv("KRYOS_AGENT_ID", "edge_001")
        return EdgeSettings(
            mqtt_host=os.getenv("KRYOS_MQTT_HOST", "localhost"),
            mqtt_port=int(os.getenv("KRYOS_MQTT_PORT", "1883")),
            mqtt_username=os.getenv("KRYOS_MQTT_USERNAME"),
            mqtt_password=os.getenv("KRYOS_MQTT_PASSWORD"),
            company_id=company,
            plant_id=plant,
            device_id=device,
            agent_id=agent,
            telemetry_topic=os.getenv(
                "KRYOS_MQTT_TELEMETRY_TOPIC",
                f"kryos/v1/{company}/{plant}/{device}/data",
            ),
            command_topic=os.getenv(
                "KRYOS_MQTT_COMMAND_TOPIC",
                f"kryos/v1/{company}/{plant}/{device}/cmd",
            ),
        )
