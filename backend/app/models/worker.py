import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    skill_category = Column(String(50), nullable=True)
    experience_years = Column(Integer, default=0)
    daily_wage = Column(Float, default=0.0)
    bio = Column(String(500), nullable=True)
    photo_url = Column(String(500), nullable=True)
    languages = Column(ARRAY(String), default=[])
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    city = Column(String(100), nullable=True)
    is_available = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    completed_jobs = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="worker_profile")
    hires = relationship("Hire", back_populates="worker", foreign_keys="Hire.worker_id")
    reviews_received = relationship("Review", back_populates="worker", foreign_keys="Review.worker_id")
