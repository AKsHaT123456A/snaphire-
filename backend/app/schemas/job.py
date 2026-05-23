from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
from app.models.job import SkillCategory, JobStatus


class JobCreate(BaseModel):
    title: str
    skill_category: SkillCategory
    description: Optional[str] = None
    workers_needed: int = 1
    daily_wage: float
    duration_days: int = 1
    latitude: float
    longitude: float
    city: Optional[str] = None
    address: Optional[str] = None
    is_urgent: bool = False
    is_immediate: bool = True
    safety_equipment: bool = False
    start_time: Optional[datetime] = None


class JobOut(BaseModel):
    id: uuid.UUID
    employer_id: uuid.UUID
    title: str
    skill_category: str
    description: Optional[str]
    workers_needed: int
    daily_wage: float
    duration_days: int
    latitude: float
    longitude: float
    city: Optional[str]
    address: Optional[str]
    is_urgent: bool
    is_immediate: bool
    safety_equipment: bool
    start_time: Optional[datetime]
    status: str
    created_at: datetime
    employer_name: Optional[str] = None
    employer_company: Optional[str] = None
    distance_km: Optional[float] = None
    hires_count: Optional[int] = 0

    class Config:
        from_attributes = True
