from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
from app.models.hire import HireStatus


class HireCreate(BaseModel):
    job_id: uuid.UUID
    worker_id: uuid.UUID
    agreed_wage: float
    note: Optional[str] = None


class HireStatusUpdate(BaseModel):
    status: HireStatus


class HireOut(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    worker_id: uuid.UUID
    employer_id: uuid.UUID
    agreed_wage: float
    status: str
    note: Optional[str]
    created_at: datetime
    updated_at: datetime
    job_title: Optional[str] = None
    worker_name: Optional[str] = None
    employer_name: Optional[str] = None

    class Config:
        from_attributes = True
