from pydantic import BaseModel, Field
from typing import Literal, Optional
import uuid
from datetime import datetime

class UserRegistration(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    phone_number: str = Field(..., min_length=10, max_length=20)
    age: Optional[int] = Field(None, ge=1, le=120)
    gender: Optional[str] = Field(None, max_length=50)
    medical_information: Optional[str] = Field(None, max_length=1000)
    emergency_contact: Optional[str] = Field(None, max_length=200)
    id_information: Optional[str] = Field(None, max_length=500)

class RegisteredUser(BaseModel):
    id: str
    full_name: str
    phone_number: str
    age: Optional[int]
    gender: Optional[str]
    medical_information: Optional[str]
    emergency_contact: Optional[str]
    id_information: Optional[str]
    registered_at: datetime

class RegistrationResponse(BaseModel):
    success: bool
    message: str
    user_id: str

class AlertRequest(BaseModel):
    event_name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    urgency: Literal["low", "medium", "high", "critical"]
    event_slug: Optional[str] = Field(None, description="Event identifier for FAQ lookup (e.g., 'xai-vercel-hackathon')")

class AlertResponse(BaseModel):
    success: bool
    message: str
    recipients_contacted: int