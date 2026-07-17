from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Airbnb Clone API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./airbnb_clone.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
