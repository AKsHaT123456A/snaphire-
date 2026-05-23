from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import get_db
from app.models.user import User, UserRole
from app.models.wallet import Wallet
from app.schemas.auth import SendOTPRequest, VerifyOTPRequest, TokenResponse
from app.core.security import create_access_token
from app.services.otp import send_otp, verify_otp

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/send-otp")
async def send_otp_endpoint(req: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    await send_otp(req.phone)
    return {"message": "OTP sent", "otp_hint": "123456 (demo mode)"}


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp_endpoint(req: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    valid = await verify_otp(req.phone, req.otp)
    if not valid:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    result = await db.execute(select(User).where(User.phone == req.phone))
    user = result.scalar_one_or_none()

    if not user:
        user = User(phone=req.phone, role=req.role, is_verified=True)
        db.add(user)
        await db.flush()
        wallet = Wallet(user_id=user.id)
        db.add(wallet)
        await db.commit()
        await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role.value})

    profile_complete = False
    if user.role == UserRole.worker:
        wp = await db.execute(
            select(User).where(User.id == user.id)
        )
        from app.models.worker import WorkerProfile
        wp_res = await db.execute(
            select(WorkerProfile).where(WorkerProfile.user_id == user.id)
        )
        profile_complete = wp_res.scalar_one_or_none() is not None
    else:
        from app.models.employer import EmployerProfile
        ep_res = await db.execute(
            select(EmployerProfile).where(EmployerProfile.user_id == user.id)
        )
        profile_complete = ep_res.scalar_one_or_none() is not None

    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        role=user.role.value,
        profile_complete=profile_complete,
    )
