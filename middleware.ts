import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // Allow OAuth callback to reach the client so it can finalize the session
  // Supabase appends `code` (PKCE) or sometimes `access_token` in hash (not visible here).
  // If `code` exists, skip protection for this request.
  const isOAuthCallback = !!searchParams.get('code');

  // Check for Supabase auth cookies set by `@supabase/ssr` browser client
  const allCookies = request.cookies.getAll();
  const hasSupabaseCookie = allCookies.some((cookie) =>
    cookie.name.startsWith('sb-') && cookie.value && cookie.value.length > 5
  );

  const isAuthenticated = hasSupabaseCookie;

  // If user is authenticated and trying to access home page, redirect to /learn
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/learn', request.url));
  }

  // Protected paths
  const protectedPaths = ['/learn', '/review', '/leaderboard', '/profile', '/quiz'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // If not authenticated, block protected pages, except during OAuth callback exchange
  if (!isAuthenticated && isProtected && !isOAuthCallback) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If authenticated, block auth pages
  if (
    isAuthenticated &&
    (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))
  ) {
    return NextResponse.redirect(new URL('/learn', request.url));
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
