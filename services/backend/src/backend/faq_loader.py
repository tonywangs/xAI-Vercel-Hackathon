import os
from pathlib import Path
from typing import Optional


class FAQLoader:
    def __init__(self):
        self.events_dir = Path(__file__).parent / "events"

    def load_event_faq(self, event_slug: str) -> Optional[str]:
        """
        Load FAQ content for a specific event

        Args:
            event_slug: The slug identifier for the event (e.g., "xai-vercel-hackathon")

        Returns:
            FAQ content as string, or None if not found
        """
        faq_file = self.events_dir / f"{event_slug}.md"

        if not faq_file.exists():
            return None

        try:
            with open(faq_file, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            print(f"Error loading FAQ for {event_slug}: {e}")
            return None

    def get_available_events(self) -> list[str]:
        """Get list of available event slugs"""
        if not self.events_dir.exists():
            return []

        return [f.stem for f in self.events_dir.glob("*.md") if f.is_file()]

    def create_assistant_context(self, event_slug: str, alert_message: str) -> str:
        """
        Create a comprehensive context for the VAPI assistant including FAQ

        Args:
            event_slug: The event identifier
            alert_message: The original alert message

        Returns:
            Full context string for the assistant
        """
        faq_content = self.load_event_faq(event_slug)

        base_context = f"""
URGENT ALERT: {alert_message}

You are an AI assistant helping attendees during an emergency or important event alert. 

INSTRUCTIONS:
1. First, clearly communicate the urgent alert message above
2. Then offer to answer any questions about the event or emergency procedures
3. Use the FAQ information below to provide accurate, helpful responses
4. If someone asks a question not covered in the FAQ, acknowledge you don't have that specific information and suggest they contact event staff
5. Keep responses concise but helpful
6. Prioritize safety information in emergencies

"""

        if faq_content:
            base_context += f"""
EVENT FAQ INFORMATION:
{faq_content}

Remember: Use this information to answer attendee questions, but always prioritize the urgent alert message first.
"""
        else:
            base_context += """
Note: No specific FAQ information is available for this event. Direct attendees to contact event staff for detailed questions.
"""

        return base_context
