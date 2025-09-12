import os

import httpx

from .faq_loader import FAQLoader
from .models import AlertRequest, AlertResponse


class VoiceAlertService:
    def __init__(self):
        self.api_key = os.getenv("VAPI_API_KEY")
        self.faq_loader = FAQLoader()

        if not self.api_key:
            raise ValueError("VAPI API key not configured")

    async def send_call_alerts(
        self, alert: AlertRequest, phone_numbers: list[str]
    ) -> AlertResponse:
        """Send voice call alerts using VAPI with event-specific FAQ context"""
        # Create base alert message
        alert_message = f"This is an urgent {alert.urgency} alert from your event organizer. {alert.event_name}. {alert.description}. Please follow safety instructions and contact event staff if you need assistance."

        # Create comprehensive assistant context with FAQ if available
        if alert.event_slug:
            assistant_context = self.faq_loader.create_assistant_context(
                alert.event_slug, alert_message
            )
        else:
            assistant_context = f"{alert_message}\n\nI can help answer basic questions, but for specific event information, please contact event staff."

        successful_calls = 0

        async with httpx.AsyncClient() as client:
            for phone_number in phone_numbers:
                try:
                    call_payload = {
                        "phoneNumberId": os.getenv("VAPI_PHONE_NUMBER_ID"),
                        "customer": {"number": phone_number},
                        "assistant": {
                            "firstMessage": alert_message,
                            "systemMessage": assistant_context,
                            "model": {
                                "provider": "openai",
                                "model": "gpt-4",
                                "temperature": 0.1,
                            },
                            "voice": {"provider": "11labs", "voiceId": "burt"},
                        },
                    }

                    response = await client.post(
                        "https://api.vapi.ai/call",
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json",
                        },
                        json=call_payload,
                    )

                    if response.status_code == 201:
                        successful_calls += 1
                    else:
                        print(
                            f"Failed to initiate call to {phone_number}: {response.text}"
                        )

                except Exception as e:
                    print(f"Failed to call {phone_number}: {e}")

        return AlertResponse(
            success=successful_calls > 0,
            message="Voice call alerts initiated successfully",
            recipients_contacted=successful_calls,
        )
