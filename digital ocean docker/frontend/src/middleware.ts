import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow these paths without authentication:
  // - /login page
  // - /api/admin/* routes (our auth endpoints)
  // - /_next/* (Next.js internals)
  // - /favicon.ico and other static assets
  const publicPaths = [
    '/login',
    '/api/admin',
    '/_next',
    '/favicon.ico',
    '/.well-known',
    '/robots.txt',
    '/sitemap.xml'
  ];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Check for admin session cookie
  const adminSession = request.cookies.get('viw_admin_sess');
  
  // If no valid session, redirect to login
  if (!adminSession || adminSession.value !== '1') {
    const loginUrl = new URL('/login', request.url);
    // Add redirect parameter to return user to intended page after login
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
  
  // Valid session, allow access
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that aren't admin (to not interfere with client auth API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/v1|_next/static|_next/image|favicon.ico).*)',
  ],
};
