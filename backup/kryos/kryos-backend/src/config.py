from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    mqtt_host: str
    mqtt_port: int
    mqtt_username: str | None
    mqtt_password: str | None
    mqtt_telemetry_topic: str
    mqtt_command_topic: str
    mysql_host: str
    mysql_port: int
    mysql_user: str
    mysql_password: str
    mysql_database: str
    api_token: str


    @staticmethod
    def from_env() -> "Settings":
        return Settings(
            mqtt_host=os.getenv("KRYOS_MQTT_HOST", "localhost"),
            mqtt_port=int(os.getenv("KRYOS_MQTT_PORT", "1883")),
            mqtt_username=os.getenv("KRYOS_MQTT_USERNAME"),
            mqtt_password=os.getenv("KRYOS_MQTT_PASSWORD"),
            mqtt_telemetry_topic=os.getenv(
                "KRYOS_MQTT_TELEMETRY_TOPIC", "kryos/v1/+/+/+/data"
            ),
            mqtt_command_topic=os.getenv(
                "KRYOS_MQTT_COMMAND_TOPIC", "kryos/v1/{company}/{plant}/{device}/cmd"
            ),
            mysql_host=os.getenv("KRYOS_MYSQL_HOST", "localhost"),
            mysql_port=int(os.getenv("KRYOS_MYSQL_PORT", "3306")),
            mysql_user=os.getenv("KRYOS_MYSQL_USER", "kryos"),
            mysql_password=os.getenv("KRYOS_MYSQL_PASSWORD", "kryos"),
            mysql_database=os.getenv("KRYOS_MYSQL_DATABASE", "kryos"),
            api_token=os.getenv("KRYOS_API_TOKEN", "dev-token"),
        )
