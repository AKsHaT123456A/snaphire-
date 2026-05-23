from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
from app.db.base import get_db
from app.api.deps import get_current_user, require_employer, require_worker
from app.models.user import User
from app.models.hire import Hire, HireStatus
from app.models.job import Job
from app.models.worker import WorkerProfile
from app.models.employer import EmployerProfile
from app.models.wallet import Wallet, Transaction, TransactionType
from app.schemas.hire import HireCreate, HireStatusUpdate, HireOut
from app.services.notification import create_notification

router = APIRouter(prefix="/hires", tags=["hires"])


def _enrich_hire(hire: Hire, job: Job = None, worker_user: User = None, employer_user: User = None) -> HireOut:
    out = HireOut.model_validate(hire)
    if job:
        out.job_title = job.title
    if worker_user:
        out.worker_name = worker_user.name
    if employer_user:
        out.employer_name = employer_user.name
    return out


@router.post("/", response_model=HireOut)
async def create_hire(
    data: HireCreate,
    user: User = Depends(require_employer),
    db: AsyncSession = Depends(get_db),
):
    ep_res = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
    employer = ep_res.scalar_one_or_none()
    if not employer:
        raise HTTPException(status_code=400, detail="Complete employer profile first")

    job_res = await db.execute(select(Job).where(Job.id == data.job_id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    worker_res = await db.execute(select(WorkerProfile).where(WorkerProfile.id == data.worker_id))
    worker = worker_res.scalar_one_or_none()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    hire = Hire(
        job_id=data.job_id,
        worker_id=data.worker_id,
        employer_id=employer.id,
        agreed_wage=data.agreed_wage,
        note=data.note,
    )
    db.add(hire)
    await db.flush()

    worker_user_res = await db.execute(select(User).where(User.id == worker.user_id))
    worker_user = worker_user_res.scalar_one_or_none()

    await create_notification(
        db, worker.user_id,
        "New Hire Request",
        f"{user.name or 'An employer'} wants to hire you for '{job.title}'",
        "hire_request", str(hire.id),
    )
    await db.commit()
    await db.refresh(hire)
    return _enrich_hire(hire, job, worker_user, user)


@router.get("/my", response_model=List[HireOut])
async def get_my_hires(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.role.value == "worker":
        wp_res = await db.execute(select(WorkerProfile).where(WorkerProfile.user_id == user.id))
        wp = wp_res.scalar_one_or_none()
        if not wp:
            return []
        result = await db.execute(
            select(Hire, Job, User)
            .join(Job, Job.id == Hire.job_id)
            .join(EmployerProfile, EmployerProfile.id == Hire.employer_id)
            .join(User, User.id == EmployerProfile.user_id)
            .where(Hire.worker_id == wp.id)
            .order_by(Hire.created_at.desc())
        )
        rows = result.all()
        return [_enrich_hire(hire, job, user, emp_user) for hire, job, emp_user in rows]
    else:
        ep_res = await db.execute(select(EmployerProfile).where(EmployerProfile.user_id == user.id))
        ep = ep_res.scalar_one_or_none()
        if not ep:
            return []
        result = await db.execute(
            select(Hire, Job, WorkerProfile, User)
            .join(Job, Job.id == Hire.job_id)
            .join(WorkerProfile, WorkerProfile.id == Hire.worker_id)
            .join(User, User.id == WorkerProfile.user_id)
            .where(Hire.employer_id == ep.id)
            .order_by(Hire.created_at.desc())
        )
        rows = result.all()
        return [_enrich_hire(hire, job, worker_user, user) for hire, job, _, worker_user in rows]


@router.patch("/{hire_id}/status", response_model=HireOut)
async def update_hire_status(
    hire_id: str,
    data: HireStatusUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Hire, Job)
        .join(Job, Job.id == Hire.job_id)
        .where(Hire.id == uuid.UUID(hire_id))
    )
    row = result.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Hire not found")
    hire, job = row

    hire.status = data.status

    # Handle payment on completion
    if data.status == HireStatus.payment_done:
        wp_res = await db.execute(select(WorkerProfile).where(WorkerProfile.id == hire.worker_id))
        wp = wp_res.scalar_one_or_none()
        if wp:
            wp.completed_jobs += 1
            worker_wallet = await db.execute(select(Wallet).where(Wallet.user_id == wp.user_id))
            w_wallet = worker_wallet.scalar_one_or_none()
            if w_wallet:
                w_wallet.balance += hire.agreed_wage
                w_wallet.total_earned += hire.agreed_wage
                txn = Transaction(
                    wallet_id=w_wallet.id,
                    hire_id=hire.id,
                    type=TransactionType.credit,
                    amount=hire.agreed_wage,
                    description=f"Payment for {job.title}",
                )
                db.add(txn)
            await create_notification(
                db, wp.user_id,
                "Payment Received",
                f"₹{hire.agreed_wage:.0f} received for '{job.title}'",
                "payment", str(hire.id),
            )

        ep_res = await db.execute(select(EmployerProfile).where(EmployerProfile.id == hire.employer_id))
        ep = ep_res.scalar_one_or_none()
        if ep:
            ep.total_hires += 1
            emp_wallet = await db.execute(select(Wallet).where(Wallet.user_id == ep.user_id))
            e_wallet = emp_wallet.scalar_one_or_none()
            if e_wallet:
                e_wallet.total_spent += hire.agreed_wage
                txn = Transaction(
                    wallet_id=e_wallet.id,
                    hire_id=hire.id,
                    type=TransactionType.debit,
                    amount=hire.agreed_wage,
                    description=f"Payment for {job.title}",
                )
                db.add(txn)

    await db.commit()
    await db.refresh(hire)
    return HireOut.model_validate(hire)
