import os
import uuid
from datetime import datetime
from typing import Dict

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

from .models import AlertRequest, AlertResponse, UserRegistration, RegisteredUser, RegistrationResponse
from .voice_alerts import VoiceAlertService

load_dotenv()

app = FastAPI(title="Aegis Event Alerting API", version="0.1.0")

# In-memory user storage
registered_users: Dict[str, RegisteredUser] = {}

# Configuration - keep existing hardcoded numbers for backward compatibility
HARDCODED_PHONE_NUMBERS = [
    os.environ.get("VYOM_PHONE_NUMBER", ""),
    os.environ.get("TONY_PHONE_NUMBER", ""),
]

# Initialize service
voice_service = None


@app.on_event("startup")
async def startup_event():
    global voice_service
    try:
        voice_service = VoiceAlertService()
    except ValueError as e:
        print(f"Voice service initialization failed: {e}")


@app.get("/")
async def root():
    return {"message": "Aegis Event Alerting API", "status": "running"}


@app.get("/health")
async def health_check():
    all_phone_numbers = get_all_phone_numbers()
    return {
        "status": "healthy",
        "registered_users": len(registered_users),
        "total_phone_numbers": len(all_phone_numbers),
        "hardcoded_numbers": len([n for n in HARDCODED_PHONE_NUMBERS if n]),
        "voice_service": voice_service is not None,
    }

def get_all_phone_numbers():
    """Get all phone numbers from registered users plus hardcoded numbers"""
    user_numbers = [user.phone_number for user in registered_users.values()]
    hardcoded_numbers = [n for n in HARDCODED_PHONE_NUMBERS if n]
    return list(set(user_numbers + hardcoded_numbers))

@app.post("/register", response_model=RegistrationResponse)
async def register_user(registration: UserRegistration):
    """
    Register a new user for event alerts
    """
    try:
        # Check if phone number already exists
        for user in registered_users.values():
            if user.phone_number == registration.phone_number:
                raise HTTPException(status_code=400, detail="Phone number already registered")
        
        # Create new user
        user_id = str(uuid.uuid4())
        registered_user = RegisteredUser(
            id=user_id,
            full_name=registration.full_name,
            phone_number=registration.phone_number,
            age=registration.age,
            gender=registration.gender,
            medical_information=registration.medical_information,
            emergency_contact=registration.emergency_contact,
            id_information=registration.id_information,
            registered_at=datetime.utcnow()
        )
        
        # Store in memory
        registered_users[user_id] = registered_user
        
        return RegistrationResponse(
            success=True,
            message=f"User {registration.full_name} registered successfully",
            user_id=user_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.get("/users")
async def list_users():
    """
    List all registered users (for testing/admin purposes)
    """
    return {
        "total_users": len(registered_users),
        "users": [
            {
                "id": user.id,
                "full_name": user.full_name,
                "phone_number": user.phone_number,
                "registered_at": user.registered_at.isoformat()
            }
            for user in registered_users.values()
        ]
    }


@app.post("/alert", response_model=AlertResponse)
async def send_alert(alert: AlertRequest):
    """
    Send an event alert via voice call to all registered phone numbers
    """
    try:
        if not voice_service:
            raise HTTPException(
                status_code=500,
                detail="Voice service not available - check VAPI credentials",
            )

        all_phone_numbers = get_all_phone_numbers()
        return await voice_service.send_call_alerts(alert, all_phone_numbers)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send alert: {str(e)}")
