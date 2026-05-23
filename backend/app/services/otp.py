"""
Mock OTP service. In production, integrate with MSG91, Twilio, or similar.
For demo: OTP is always 123456.
"""
import random
import string
from typing import Dict
import asyncio

# In-memory OTP store (use Redis in production)
_otp_store: Dict[str, str] = {}

MOCK_OTP = "123456"


async def send_otp(phone: str) -> str:
    """Send OTP to phone. Returns OTP (mock)."""
    otp = MOCK_OTP  # Always 123456 for demo
    _otp_store[phone] = otp
    # In production: call SMS gateway here
    print(f"[MOCK OTP] Phone: {phone} OTP: {otp}")
    return otp


async def verify_otp(phone: str, otp: str) -> bool:
    """Verify OTP. Mock always accepts 123456."""
    stored = _otp_store.get(phone)
    if otp == MOCK_OTP:
        _otp_store.pop(phone, None)
        return True
    return stored == otp
