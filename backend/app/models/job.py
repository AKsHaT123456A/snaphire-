import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class SkillCategory(str, enum.Enum):
    mason = "mason"
    carpenter = "carpenter"
    electrician = "electrician"
    painter = "painter"
    plumber = "plumber"
    welder = "welder"
    tile_worker = "tile_worker"
    driver = "driver"
    labour_helper = "labour_helper"
    ac_technician = "ac_technician"


class JobStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("employer_profiles.id"), nullable=False)
    title = Column(String(200), nullable=False)
    skill_category = Column(SAEnum(SkillCategory), nullable=False)
    description = Column(Text, nullable=True)
    workers_needed = Column(Integer, default=1)
    daily_wage = Column(Float, nullable=False)
    duration_days = Column(Integer, default=1)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    city = Column(String(100), nullable=True)
    address = Column(String(300), nullable=True)
    is_urgent = Column(Boolean, default=False)
    is_immediate = Column(Boolean, default=True)
    safety_equipment = Column(Boolean, default=False)
    start_time = Column(DateTime, nullable=True)
    status = Column(SAEnum(JobStatus), default=JobStatus.open)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employer = relationship("EmployerProfile", back_populates="jobs")
    hires = relationship("Hire", back_populates="job")
