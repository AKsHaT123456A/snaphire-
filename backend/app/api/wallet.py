from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.base import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.wallet import Wallet, Transaction
from app.schemas.wallet import WalletOut, TransactionOut

router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("/", response_model=WalletOut)
async def get_wallet(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Wallet).where(Wallet.user_id == user.id))
    wallet = result.scalar_one_or_none()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return wallet


@router.get("/transactions", response_model=List[TransactionOut])
async def get_transactions(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wallet_res = await db.execute(select(Wallet).where(Wallet.user_id == user.id))
    wallet = wallet_res.scalar_one_or_none()
    if not wallet:
        return []
    result = await db.execute(
        select(Transaction)
        .where(Transaction.wallet_id == wallet.id)
        .order_by(Transaction.created_at.desc())
        .limit(100)
    )
    return result.scalars().all()
