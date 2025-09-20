# Aegis: AI-Powered Emergency Communication and Search and Rescue

> [**1st Place Overall Winner**](https://community.vercel.com/t/xai-vercel-hackathon/18688) at the [xAI + Vercel Hackathon 2025](https://partiful.com/e/sa3etfyhGd50TSuWUktU)

Aegis is an emergency response platform that combines computer vision, natural language processing, and real-time geospatial intelligence to create an autonomous emergency communication system. When disaster strikes, whether you're lost in the mountains, trapped in a building, or caught in a natural disaster, Aegis becomes your AI-powered lifeline.

## Problem

Traditional emergency response systems rely on human operators and static communication protocols. In high-stress, time-critical situations, this creates dangerous delays and information gaps. Aegis eliminates these bottlenecks by deploying AI agents that can:

- **Instantly process visual information** from ID documents to establish identity and medical history
- **Maintain continuous situational awareness** through real-time location tracking
- **Conduct intelligent two-way conversations** to assess emergency conditions and provide personalized guidance
- **Adapt communication strategies** based on user medical conditions, location context, and emergency severity

## Technical Architecture

### Core AI Components

#### 1. **Computer Vision Identity System**
- **Model**: xAI Grok-2-Vision-1212
- **Capability**: Real-time document processing and medical information extraction
- **Use Case**: When someone is unconscious or unable to communicate, Aegis can instantly identify them and access their medical history from uploaded ID documents

#### 2. **Conversational Emergency AI**
- **Model**: xAI Grok-3 with custom emergency response fine-tuning
- **Capability**: Context-aware, multi-turn conversations in high-stress scenarios
- **Features**:
  - Medical condition awareness
  - Location-specific guidance
  - Emergency protocol knowledge
  - Emotional intelligence for crisis communication

#### 3. **Real-Time Geospatial Intelligence**
- **Technology**: High-frequency GPS tracking with accuracy optimization
- **Capability**: Continuous location monitoring with predictive modeling
- **Applications**: Search & rescue coordination, evacuation route optimization, hazard zone detection

## Technical Implementation

### Real-Time Data Processing

- **Location Updates**: 1Hz GPS sampling with sub-meter accuracy
- **Voice Processing**: <200ms latency for emergency call initiation
- **AI Response Time**: <500ms for context-aware emergency guidance
- **Multi-Modal Fusion**: Simultaneous processing of visual, textual, and geospatial data

## Use Cases & Applications

### Search & Rescue Operations
- **Mountain Rescue**: AI guides lost hikers to safety using real-time location data and terrain analysis
- **Urban Emergency**: Coordinates evacuation routes during building fires or natural disasters
- **Medical Emergencies**: Provides immediate medical guidance based on user's medical history

### Disaster Response
- **Natural Disasters**: Mass communication system for evacuation orders and safety updates
- **Infrastructure Failures**: Real-time coordination during power outages or transportation disruptions
- **Public Safety**: Crowd management and emergency communication during large events

### Personal Safety
- **Travel Safety**: Continuous monitoring and emergency assistance for solo travelers
- **Elderly Care**: AI-powered check-ins and emergency response for vulnerable populations
- **Medical Monitoring**: Proactive health monitoring with emergency intervention capabilities

## Technical Stack

### AI & Machine Learning
- **xAI Grok-2-Vision-1212**: Document processing and visual information extraction
- **xAI Grok-3**: Conversational AI with emergency response specialization
- **Custom NLP Pipelines**: Emergency protocol understanding and response generation

### Infrastructure
- **Next.js 14**: High-performance frontend with real-time updates
- **FastAPI**: Async backend with sub-100ms response times
- **VAPI.ai**: Voice synthesis and real-time communication
- **Google Maps API**: Advanced geospatial visualization and analysis

### Data Processing
- **Real-time GPS Tracking**: High-frequency location updates with accuracy optimization
- **Multi-Modal Data Fusion**: Simultaneous processing of visual, textual, and geospatial data
- **Predictive Analytics**: Emergency risk assessment and proactive intervention

## Installation & Setup

### Prerequisites
- Node.js 18+ (for real-time frontend)
- Python 3.10+ (for AI processing)
- xAI API access (for Grok models)
- VAPI.ai account (for voice synthesis)

### Environment Configuration

```bash
# AI Services
XAI_API_KEY=your_grok_api_key
VAPI_API_KEY=your_voice_synthesis_key
VAPI_PHONE_NUMBER_ID=your_phone_id

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Geospatial Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Contacts
VYOM_PHONE_NUMBER="+1234567890"
TONY_PHONE_NUMBER="+1234567890"

```

### Quick Start

   ```bash
# Clone and setup
git clone https://github.com/tonywangs/xAI-Vercel-Hackathon
cd aegis

# Install dependencies
cd frontend && npm install
cd ../services/backend && pip install -r requirements.txt

# Start AI services
python -m backend &
cd ../frontend && npm run dev
```