from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from app.db.base import get_db
from app.api.deps import require_employer
from app.models.user import User
from app.models.hire import Hire, HireStatus
from app.models.review import Review
from app.models.worker import WorkerProfile
from app.models.employer import EmployerProfile
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewOut)
async def create_review(
    data: ReviewCreate,
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    ep_res = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    employer = ep_res.scalar_one_or_none()

    hire_res = await db.execute(select(Hire).where(Hire.id == data.hire_id))
    hire = hire_res.scalar_one_or_none()
    if not hire or hire.employer_id != employer.id:
        raise HTTPException(status_code=404, detail="Hire not found")
    if hire.status not in [HireStatus.completed, HireStatus.payment_done]:
        raise HTTPException(status_code=400, detail="Can only review completed hires")

    review = Review(
        hire_id=data.hire_id,
        worker_id=hire.worker_id,
        employer_id=employer.id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    await db.flush()

    # Update worker rating
    wp_res = await db.execute(select(WorkerProfile).where(WorkerProfile.id == hire.worker_id))
    wp = wp_res.scalar_one_or_none()
    if wp:
        avg_res = await db.execute(
            select(func.avg(Review.rating)).where(Review.worker_id == wp.id)
        )
        count_res = await db.execute(
            select(func.count(Review.id)).where(Review.worker_id == wp.id)
        )
        wp.rating = round(avg_res.scalar() or 0, 1)
        wp.total_reviews = count_res.scalar() or 0

    await db.commit()
    await db.refresh(review)
    return review


@router.get("/worker/{worker_id}", response_model=List[ReviewOut])
async def get_worker_reviews(worker_id: str, db: AsyncSession = Depends(get_db)):
    import uuid
    result = await db.execute(
        select(Review)
        .where(Review.worker_id == uuid.UUID(worker_id))
        .order_by(Review.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()
