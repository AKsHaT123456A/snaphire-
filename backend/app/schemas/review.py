from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class ReviewCreate(BaseModel):
    hire_id: uuid.UUID
    rating: float
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: uuid.UUID
    hire_id: uuid.UUID
    worker_id: uuid.UUID
    employer_id: uuid.UUID
    rating: float
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
