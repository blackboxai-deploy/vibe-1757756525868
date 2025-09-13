import { NextRequest, NextResponse } from 'next/server';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, accept any email/password combination
    // In a real application, you would verify against a database
    if (email.includes('@') && password.length >= 6) {
      const user = {
        id: Date.now(),
        email,
        anonymousId: `anonymous_${Math.random().toString(36).substr(2, 9)}`,
        loginTime: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        user,
        message: 'Login successful'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}