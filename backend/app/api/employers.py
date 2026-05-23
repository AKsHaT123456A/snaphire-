from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import get_db
from app.api.deps import get_current_user, require_employer
from app.models.user import User
from app.models.employer import EmployerProfile
from app.schemas.employer import EmployerProfileCreate, EmployerProfileUpdate, EmployerProfileOut

router = APIRouter(prefix="/employers", tags=["employers"])


@router.post("/profile", response_model=EmployerProfileOut)
async def create_employer_profile(
    data: EmployerProfileCreate,
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Profile already exists")

    user.name = data.name
    profile = EmployerProfile(
        user_id=user.id,
        company_name=data.company_name,
        industry=data.industry,
        latitude=data.latitude,
        longitude=data.longitude,
        city=data.city,
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    out = EmployerProfileOut.model_validate(profile)
    out.name = user.name
    out.phone = user.phone
    return out


@router.get("/profile/me", response_model=EmployerProfileOut)
async def get_my_employer_profile(
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    out = EmployerProfileOut.model_validate(profile)
    out.name = user.name
    out.phone = user.phone
    return out


@router.put("/profile/me", response_model=EmployerProfileOut)
async def update_employer_profile(
    data: EmployerProfileUpdate,
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    if data.name:
        user.name = data.name
    await db.commit()
    await db.refresh(profile)
    out = EmployerProfileOut.model_validate(profile)
    out.name = user.name
    out.phone = user.phone
    return out
