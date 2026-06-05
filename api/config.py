from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "bookando"
    JWT_SECRET: str = "dev-jwt-secret-bookando-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14
    APP_BASE_URL: str = "http://localhost:8000"
    FRONTEND_BASE_URL: str = "http://localhost:3000"
    CORS_ORIGINS: str = "http://localhost:3000,https://bookando.vercel.app,https://app.bookando.de"
    FROM_EMAIL: str = "noreply@nexifyai.cloud"
    RESEND_API_KEY: str = ""
    STRIPE_API_KEY: str = ""
    class Config: env_file = ".env"

settings = Settings()
