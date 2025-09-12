from pydantic import BaseModel, Field
from typing import Literal, Optional

class AlertRequest(BaseModel):
    mode: Literal["call", "text"]
    event_name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    urgency: Literal["low", "medium", "high", "critical"]
    event_slug: Optional[str] = Field(None, description="Event identifier for FAQ lookup (e.g., 'xai-vercel-hackathon')")

class AlertResponse(BaseModel):
    success: bool
    message: str
    recipients_contacted: int