import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Simulate authentication check (replace with real auth logic)
  const isAuthenticated = true; // TODO: Replace with real auth state
  
  // If user is authenticated and trying to access home page, redirect to /learn
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/learn', request.url));
  }
  
  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && pathname.startsWith('/learn')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (!isAuthenticated && pathname.startsWith('/review')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (!isAuthenticated && pathname.startsWith('/leaderboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (!isAuthenticated && pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (!isAuthenticated && pathname.startsWith('/quiz')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
