import { NextRequest, NextResponse } from 'next/server';
import { UserRegistration, UserRegistrationResponse } from '@/types/api';

// This is a placeholder API route for the backend team
// Replace this with actual backend integration

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const userData: UserRegistration = {
      phoneNumber: formData.get('phoneNumber') as string,
      name: formData.get('name') as string,
      medicalInfo: formData.get('medicalInfo') as string || undefined,
      emergencyContact: formData.get('emergencyContact') as string || undefined,
      age: formData.get('age') ? parseInt(formData.get('age') as string) : undefined,
      idScan: formData.get('idScan') as File || undefined,
    };

    // TODO: Replace with actual backend API call
    // Example:
    // const response = await fetch('YOUR_BACKEND_URL/api/users/register', {
    //   method: 'POST',
    //   body: formData,
    // });
    // const result = await response.json();

    // Simulate API response
    const result: UserRegistrationResponse = {
      success: true,
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      message: 'User registered successfully',
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
