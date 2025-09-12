import os
import uuid
from datetime import datetime
from typing import Dict

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import AlertRequest, AlertResponse, UserRegistration, RegisteredUser, RegistrationResponse, LocationUpdate, UserLocation, LocationResponse
from .voice_alerts import VoiceAlertService

load_dotenv()

app = FastAPI(title="Aegis Event Alerting API", version="0.1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# In-memory user storage
registered_users: Dict[str, RegisteredUser] = {}

# In-memory location storage
user_locations: Dict[str, UserLocation] = {}

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
    Get all registered users with full details for admin dashboard
    """
    return {
        "total_users": len(registered_users),
        "users": [
            {
                "id": user.id,
                "full_name": user.full_name,
                "phone_number": user.phone_number,
                "age": user.age,
                "gender": user.gender,
                "medical_information": user.medical_information,
                "emergency_contact": user.emergency_contact,
                "id_information": user.id_information,
                "registered_at": user.registered_at.isoformat()
            }
            for user in registered_users.values()
        ],
        "hardcoded_numbers": [n for n in HARDCODED_PHONE_NUMBERS if n]
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

@app.post("/location", response_model=LocationResponse)
async def update_user_location(location: LocationUpdate):
    """
    Update a user's GPS location
    """
    try:
        # Check if user exists
        if location.user_id not in registered_users:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = registered_users[location.user_id]
        
        # Create or update location record
        user_location = UserLocation(
            user_id=location.user_id,
            user_name=user.full_name,
            phone_number=user.phone_number,
            latitude=location.latitude,
            longitude=location.longitude,
            accuracy=location.accuracy,
            last_updated=datetime.utcnow(),
            status="online"
        )
        
        # Store in memory
        user_locations[location.user_id] = user_location
        
        print(f"📍 Location updated for {user.full_name}: {location.latitude}, {location.longitude}")
        
        return LocationResponse(
            success=True,
            message=f"Location updated for {user.full_name}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update location: {str(e)}")

@app.get("/locations")
async def get_all_locations():
    """
    Get all user locations for admin dashboard
    """
    # Mark users as offline if they haven't updated location in 5 minutes
    cutoff_time = datetime.utcnow()
    for location in user_locations.values():
        time_diff = cutoff_time - location.last_updated
        if time_diff.total_seconds() > 300:  # 5 minutes
            location.status = "offline"
    
    return {
        "total_locations": len(user_locations),
        "locations": [
            {
                "user_id": loc.user_id,
                "user_name": loc.user_name,
                "phone_number": loc.phone_number,
                "latitude": loc.latitude,
                "longitude": loc.longitude,
                "accuracy": loc.accuracy,
                "last_updated": loc.last_updated.isoformat(),
                "status": loc.status
            }
            for loc in user_locations.values()
        ]
    }
