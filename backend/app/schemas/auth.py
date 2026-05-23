from pydantic import BaseModel
from app.models.user import UserRole


class SendOTPRequest(BaseModel):
    phone: str
    role: UserRole


class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    role: UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    profile_complete: bool
