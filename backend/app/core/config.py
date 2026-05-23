import os
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from pydantic_settings import BaseSettings


def _normalize_asyncpg(url: str) -> str:
    """Ensure the async engine gets +asyncpg even if the env var is bare postgresql://."""
    if url.startswith("postgres://") and not url.startswith("postgresql://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://") and "+" not in url.split("://")[0]:
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

    # Strip channel_binding=require because asyncpg doesn't support it (Neon adds it)
    parsed = urlparse(url)
    query_params = parse_qs(parsed.query)
    if "channel_binding" in query_params:
        del query_params["channel_binding"]
        new_query = urlencode(query_params, doseq=True)
        url = urlunparse(
            (
                parsed.scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                new_query,
                parsed.fragment,
            )
        )

    return url


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str = "redis://redis:6379"
    SECRET_KEY: str = "snaphire-super-secret-jwt-key-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    class Config:
        env_file = ".env"

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        return _normalize_asyncpg(self.DATABASE_URL)

    @property
    def SYNC_DATABASE_URL(self) -> str:
        url = self.ASYNC_DATABASE_URL
        for async_prefix, sync_prefix in (
            ("postgresql+asyncpg://", "postgresql+psycopg2://"),
            ("postgresql+asyncpg+ssl://", "postgresql+psycopg2://"),
        ):
            if url.startswith(async_prefix):
                return url.replace(async_prefix, sync_prefix, 1)
        return url


# Provide a local-only default when running inside Docker Compose so that
# the container doesn't crash immediately when .env is missing.
default_url = (
    "postgresql+asyncpg://snaphire:snaphire123@db:5432/snaphire"
    if not os.getenv("DATABASE_URL")
    else None
)

settings = Settings(DATABASE_URL=default_url) if default_url else Settings()
