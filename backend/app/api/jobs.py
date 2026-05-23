from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import uuid
from app.db.base import get_db
from app.api.deps import get_current_user, require_employer
from app.models.user import User
from app.models.job import Job, JobStatus
from app.models.employer import EmployerProfile
from app.models.hire import Hire
from app.schemas.job import JobCreate, JobOut
from app.services.geo import haversine_km

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _enrich_job(job: Job, employer: EmployerProfile, employer_user: User, dist: Optional[float] = None, hires_count: int = 0) -> JobOut:
    out = JobOut.model_validate(job)
    out.employer_name = employer_user.name
    out.employer_company = employer.company_name
    out.distance_km = round(dist, 2) if dist is not None else None
    out.hires_count = hires_count
    return out


@router.post("/", response_model=JobOut)
async def create_job(
    data: JobCreate,
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    ep_res = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    employer = ep_res.scalar_one_or_none()
    if not employer:
        raise HTTPException(status_code=400, detail="Complete employer profile first")

    job = Job(**data.model_dump(), employer_id=employer.id)
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return _enrich_job(job, employer, user, hires_count=0)


@router.get("/nearby", response_model=List[JobOut])
async def get_nearby_jobs(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(default=15.0),
    skill: Optional[str] = Query(default=None),
    urgent_only: bool = Query(default=False),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = (
        select(Job, EmployerProfile, User)
        .join(EmployerProfile, EmployerProfile.id == Job.employer_id)
        .join(User, User.id == EmployerProfile.user_id)
        .where(Job.status == JobStatus.open)
        .where(Job.is_deleted == False)
    )
    if skill:
        query = query.where(Job.skill_category == skill)
    if urgent_only:
        query = query.where(Job.is_urgent == True)

    result = await db.execute(query)
    rows = result.all()

    jobs = []
    for job, employer, emp_user in rows:
        dist = haversine_km(lat, lng, job.latitude, job.longitude)
        if dist <= radius_km:
            hires_res = await db.execute(select(func.count(Hire.id)).where(Hire.job_id == job.id))
            hires_count = hires_res.scalar() or 0
            jobs.append(_enrich_job(job, employer, emp_user, dist, hires_count))

    jobs.sort(key=lambda j: j.distance_km or 999)
    return jobs


@router.get("/my", response_model=List[JobOut])
async def get_my_jobs(
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    ep_res = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    employer = ep_res.scalar_one_or_none()
    if not employer:
        return []

    result = await db.execute(
        select(Job).where(Job.employer_id == employer.id, Job.is_deleted == False)
        .order_by(Job.created_at.desc())
    )
    jobs = result.scalars().all()
    out = []
    for job in jobs:
        hires_res = await db.execute(select(func.count(Hire.id)).where(Hire.job_id == job.id))
        hires_count = hires_res.scalar() or 0
        out.append(_enrich_job(job, employer, user, hires_count=hires_count))
    return out


@router.get("/{job_id}", response_model=JobOut)
async def get_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Job, EmployerProfile, User)
        .join(EmployerProfile, EmployerProfile.id == Job.employer_id)
        .join(User, User.id == EmployerProfile.user_id)
        .where(Job.id == uuid.UUID(job_id))
    )
    row = result.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Job not found")
    job, employer, emp_user = row
    hires_res = await db.execute(select(func.count(Hire.id)).where(Hire.job_id == job.id))
    hires_count = hires_res.scalar() or 0
    return _enrich_job(job, employer, emp_user, hires_count=hires_count)


@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    ep_res = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    employer = ep_res.scalar_one_or_none()
    result = await db.execute(select(Job).where(Job.id == uuid.UUID(job_id), Job.employer_id == employer.id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.is_deleted = True
    await db.commit()
    return {"message": "Job deleted"}
