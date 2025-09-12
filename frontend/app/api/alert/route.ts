import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json();

    // Call backend alert API
    const response = await fetch(`${BACKEND_URL}/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to send alert');
    }

    const result = await response.json();
    
    // Return in expected frontend format
    return NextResponse.json({
      success: result.success,
      message: result.message,
      recipients_contacted: result.recipients_contacted,
    });

  } catch (error) {
    console.error('Alert sending error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send alert' 
      },
      { status: 500 }
    );
  }
}