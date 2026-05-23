import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class HireStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    on_the_way = "on_the_way"
    started = "started"
    completed = "completed"
    payment_pending = "payment_pending"
    payment_done = "payment_done"
    cancelled = "cancelled"


class Hire(Base):
    __tablename__ = "hires"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("worker_profiles.id"), nullable=False)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("employer_profiles.id"), nullable=False)
    agreed_wage = Column(Float, nullable=False)
    status = Column(SAEnum(HireStatus), default=HireStatus.pending)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("Job", back_populates="hires")
    worker = relationship("WorkerProfile", back_populates="hires", foreign_keys=[worker_id])
    employer = relationship("EmployerProfile", back_populates="hires", foreign_keys=[employer_id])
