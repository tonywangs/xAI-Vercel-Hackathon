import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from .models import AlertRequest, AlertResponse
from .text_alerts import TextAlertService
from .voice_alerts import VoiceAlertService

load_dotenv()

app = FastAPI(title="Aegis Event Alerting API", version="0.1.0")

# Configuration
REGISTERED_PHONE_NUMBERS = [
    os.environ["VYOM_PHONE_NUMBER"],
    os.environ["TONY_PHONE_NUMBER"],
]

# Initialize services
text_service = None
voice_service = None

@app.on_event("startup")
async def startup_event():
    global text_service, voice_service
    try:
        text_service = TextAlertService()
    except ValueError as e:
        print(f"Text service initialization failed: {e}")
    
    try:
        voice_service = VoiceAlertService()
    except ValueError as e:
        print(f"Voice service initialization failed: {e}")

@app.get("/")
async def root():
    return {"message": "Aegis Event Alerting API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "registered_numbers": len(REGISTERED_PHONE_NUMBERS),
        "text_service": text_service is not None,
        "voice_service": voice_service is not None
    }

@app.post("/alert", response_model=AlertResponse)
async def send_alert(alert: AlertRequest):
    """
    Send an event alert via text or call to all registered phone numbers
    """
    try:
        if alert.mode == "text":
            if not text_service:
                raise HTTPException(status_code=500, detail="Text service not available - check Twilio credentials")
            return await text_service.send_text_alerts(alert, REGISTERED_PHONE_NUMBERS)
        
        elif alert.mode == "call":
            if not voice_service:
                raise HTTPException(status_code=500, detail="Voice service not available - check VAPI credentials")
            return await voice_service.send_call_alerts(alert, REGISTERED_PHONE_NUMBERS)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send alert: {str(e)}")
