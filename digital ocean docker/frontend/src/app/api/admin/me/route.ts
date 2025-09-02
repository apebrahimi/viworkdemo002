import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if admin session cookie exists
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('viw_admin_sess');

    if (!adminSession || adminSession.value !== '1') {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

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
