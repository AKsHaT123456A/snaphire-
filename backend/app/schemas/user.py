from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class UserOut(BaseModel):
    id: uuid.UUID
    phone: str
    name: Optional[str]
    role: str
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
