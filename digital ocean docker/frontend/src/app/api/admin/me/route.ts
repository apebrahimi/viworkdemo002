import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if admin session cookie exists
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('viw_admin_sess');

    console.log('Auth check:', { 
      hasCookie: !!adminSession, 
      cookieValue: adminSession?.value,
      envLoaded: { 
        ADMIN_USERNAME: !!process.env.ADMIN_USERNAME, 
        ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD 
      }
    });

    if (!adminSession || adminSession.value !== '1') {
      console.log('Authentication failed: Invalid or missing session cookie');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    console.log('Authentication successful for admin user');

    // Return authenticated status
    return NextResponse.json({ 
      authenticated: true,
      user: {
        username: process.env.ADMIN_USERNAME || 'admin',
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
