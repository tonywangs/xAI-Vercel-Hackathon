import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data and map to backend format
    const registrationData = {
      full_name: formData.get('name') as string,
      phone_number: formData.get('phoneNumber') as string,
      age: formData.get('age') ? parseInt(formData.get('age') as string) : undefined,
      gender: undefined, // Not collected in current form
      medical_information: formData.get('medicalInfo') as string || undefined,
      emergency_contact: formData.get('emergencyContact') as string || undefined,
      id_information: formData.get('idScan') ? 'ID document uploaded' : undefined, // Simplified for now
    };

    // Call backend registration API
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const result = await response.json();
    
    // Return in expected frontend format
    return NextResponse.json({
      success: result.success,
      userId: result.user_id,
      message: result.message,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      },
      { status: 500 }
    );
  }
}
