from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class WalletOut(BaseModel):
    id: uuid.UUID
    balance: float
    total_earned: float
    total_spent: float

    class Config:
        from_attributes = True


class TransactionOut(BaseModel):
    id: uuid.UUID
    type: str
    amount: float
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
