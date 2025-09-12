import os
from twilio.rest import Client
from fastapi import HTTPException
from .models import AlertRequest, AlertResponse

class TextAlertService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        
        if not all([self.account_sid, self.auth_token, self.phone_number]):
            raise ValueError("Twilio credentials not configured")
            
        self.client = Client(self.account_sid, self.auth_token)
    
    async def send_text_alerts(self, alert: AlertRequest, phone_numbers: list[str]) -> AlertResponse:
        """Send SMS alerts using Twilio"""
        message_body = f"🚨 {alert.event_name.upper()}\n\n{alert.description}\n\nUrgency: {alert.urgency.upper()}\n\nReply for more info."
        
        successful_sends = 0
        
        for phone_number in phone_numbers:
            try:
                message = self.client.messages.create(
                    body=message_body,
                    from_=self.phone_number,
                    to=phone_number
                )
                successful_sends += 1
            except Exception as e:
                print(f"Failed to send SMS to {phone_number}: {e}")
        
        return AlertResponse(
            success=successful_sends > 0,
            message=f"Text alerts sent successfully",
            recipients_contacted=successful_sends
        )