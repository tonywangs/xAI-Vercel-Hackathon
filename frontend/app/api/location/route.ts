import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const locationData = await request.json();

    const response = await fetch(`${BACKEND_URL}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update location');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Location update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update location' 
      },
      { status: 500 }
    );
  }
}