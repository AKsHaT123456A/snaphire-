from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.db.base import get_db
from app.api.deps import get_current_user, require_worker
from app.models.user import User
from app.models.worker import WorkerProfile
from app.schemas.worker import WorkerProfileCreate, WorkerProfileUpdate, WorkerProfileOut
from app.services.geo import haversine_km

router = APIRouter(prefix="/workers", tags=["workers"])


@router.post("/profile", response_model=WorkerProfileOut)
async def create_worker_profile(
    data: WorkerProfileCreate,
    user: User = Depends(require_worker),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(WorkerProfile).where(WorkerProfile.user_id == user.id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Profile already exists")

    user.name = data.name
    profile = WorkerProfile(
        user_id=user.id,
        skill_category=data.skill_category,
        experience_years=data.experience_years,
        daily_wage=data.daily_wage,
        bio=data.bio,
        languages=data.languages,
        latitude=data.latitude,
        longitude=data.longitude,
        city=data.city,
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    out = WorkerProfileOut.model_validate(profile)
    out.name = user.name
    out.phone = user.phone
    return out


@router.get("/profile/me", response_model=WorkerProfileOut)
async def get_my_worker_profile(
    user: User = Depends(require_worker),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(WorkerProfile).where(WorkerProfile.user_id == user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    out = WorkerProfileOut.model_validate(profile)
    out.name = user.name
    out.phone = user.phone
    return out


@router.put("/profile/me", response_model=WorkerProfileOut)
async def update_worker_profile(
    data: WorkerProfileUpdate,
    user: User = Depends(require_worker),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(WorkerProfile).where(WorkerProfile.user_id == user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    if data.name:
        user.name = data.name
    await db.commit()
    await db.refresh(profile)
    out = WorkerProfileOut.model_validate(profile)
    out.name = user.name
    out.phone = user.phone
    return out


@router.get("/nearby", response_model=List[WorkerProfileOut])
async def get_nearby_workers(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(default=10.0),
    skill: Optional[str] = Query(default=None),
    min_rating: Optional[float] = Query(default=None),
    available_only: bool = Query(default=True),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(WorkerProfile, User).join(User, User.id == WorkerProfile.user_id)
    if available_only:
        query = query.where(WorkerProfile.is_available == True)
    if skill:
        query = query.where(WorkerProfile.skill_category == skill)
    if min_rating:
        query = query.where(WorkerProfile.rating >= min_rating)

    result = await db.execute(query)
    rows = result.all()

    workers = []
    for profile, u in rows:
        if profile.latitude is None or profile.longitude is None:
            continue
        dist = haversine_km(lat, lng, profile.latitude, profile.longitude)
        if dist <= radius_km:
            out = WorkerProfileOut.model_validate(profile)
            out.name = u.name
            out.phone = u.phone
            out.distance_km = round(dist, 2)
            workers.append(out)

    workers.sort(key=lambda w: w.distance_km or 999)
    return workers


@router.get("/{worker_id}", response_model=WorkerProfileOut)
async def get_worker_profile(
    worker_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    import uuid
    result = await db.execute(
        select(WorkerProfile, User)
        .join(User, User.id == WorkerProfile.user_id)
        .where(WorkerProfile.id == uuid.UUID(worker_id))
    )
    row = result.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Worker not found")
    profile, u = row
    out = WorkerProfileOut.model_validate(profile)
    out.name = u.name
    out.phone = u.phone
    return out
