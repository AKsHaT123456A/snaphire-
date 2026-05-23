import sys

sys.path.insert(0, "D:/snaphire/backend")

# Test the normalization logic directly
from app.core.config import _normalize_asyncpg

urls = [
    "postgresql://user:pass@host/db?sslmode=require&channel_binding=require",
    "postgres://user:pass@host/db?sslmode=require",
    "postgresql+asyncpg://user:pass@host/db?sslmode=require&channel_binding=require",
]

for u in urls:
    print(f"IN:  {u}")
    print(f"OUT: {_normalize_asyncpg(u)}")
    print()
