import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # Usamos validation_alias para mapear a chave do arquivo .env
    database_url: str = Field(
        'mysql+mysqlconnector://root:root@localhost:3305/kryos',
        validation_alias='DATABASE_URL'
    )
    
    openai_api_key: str | None = Field(
        default=None, 
        validation_alias='OPENAI_API_KEY'
    )
    
    ai_model: str = Field(
        'gpt-4o-mini', 
        validation_alias='AI_MODEL'
    )

    poll_interval_seconds: int = Field(
        5,
        validation_alias='POLL_INTERVAL_SECONDS'
    )

    telemetry_retention_days: int = Field(
        30,
        validation_alias='TELEMETRY_RETENTION_DAYS'
    )

    readings_retention_days: int = Field(
        7,
        validation_alias='READINGS_RETENTION_DAYS'
    )

    retention_cleanup_interval_seconds: int = Field(
        3600,
        validation_alias='RETENTION_CLEANUP_INTERVAL_SECONDS'
    )

    db_pool_size: int = Field(
        32,
        validation_alias='DB_POOL_SIZE'
    )

    modbus_server_map_file: str | None = Field(
        None,
        validation_alias='MODBUS_SERVER_MAP_FILE'
    )
    
    allowed_origins: list[str] = Field(default_factory=lambda: ['*'])

    # Configuração oficial do Pydantic v2 (substitui a antiga 'class Config')
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
