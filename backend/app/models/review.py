import uuid
from datetime import datetime
from sqlalchemy import Column, Float, DateTime, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hire_id = Column(UUID(as_uuid=True), ForeignKey("hires.id"), nullable=False)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("worker_profiles.id"), nullable=False)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("employer_profiles.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    worker = relationship("WorkerProfile", back_populates="reviews_received", foreign_keys=[worker_id])
