import { NextRequest, NextResponse } from 'next/server';

interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, confirmPassword } = body;

    // Validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // For demo purposes, always create a new user
    // In a real application, you would check if user exists and hash the password
    const user = {
      id: Date.now(),
      email,
      anonymousId: `anonymous_${Math.random().toString(36).substr(2, 9)}`,
      joinDate: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      user,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}