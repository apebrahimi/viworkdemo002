import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
    const sessionTTL = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS || '28800', 10);

    // Validate credentials
    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { ok: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set secure cookie for admin session
    const cookieStore = await cookies();
    cookieStore.set('viw_admin_sess', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',  // Available for entire admin panel
      maxAge: sessionTTL,
    });

    return NextResponse.json({ 
      ok: true,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
