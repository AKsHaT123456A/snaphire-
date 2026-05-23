from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class NotificationOut(BaseModel):
    id: uuid.UUID
    title: str
    body: str
    type: Optional[str]
    ref_id: Optional[str]
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
