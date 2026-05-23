from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class EmployerProfileCreate(BaseModel):
    name: str
    company_name: Optional[str] = None
    industry: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None


class EmployerProfileUpdate(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None


class EmployerProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_name: Optional[str]
    industry: Optional[str]
    photo_url: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    city: Optional[str]
    rating: float
    total_reviews: int
    total_hires: int
    is_verified: bool
    name: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True
