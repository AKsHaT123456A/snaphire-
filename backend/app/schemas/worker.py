from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class WorkerProfileCreate(BaseModel):
    name: str
    skill_category: str
    experience_years: int = 0
    daily_wage: float
    bio: Optional[str] = None
    languages: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None


class WorkerProfileUpdate(BaseModel):
    name: Optional[str] = None
    skill_category: Optional[str] = None
    experience_years: Optional[int] = None
    daily_wage: Optional[float] = None
    bio: Optional[str] = None
    languages: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    is_available: Optional[bool] = None


class WorkerProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    skill_category: Optional[str]
    experience_years: int
    daily_wage: float
    bio: Optional[str]
    photo_url: Optional[str]
    languages: List[str]
    latitude: Optional[float]
    longitude: Optional[float]
    city: Optional[str]
    is_available: bool
    is_verified: bool
    rating: float
    total_reviews: int
    completed_jobs: int
    name: Optional[str] = None
    phone: Optional[str] = None
    distance_km: Optional[float] = None

    class Config:
        from_attributes = True
