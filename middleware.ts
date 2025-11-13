import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // Allow OAuth callback to reach the client so it can finalize the session
  // Supabase appends `code` (PKCE) or sometimes `access_token` in hash (not visible here).
  // If `code` exists, skip protection for this request.
  const isOAuthCallback = !!searchParams.get('code');

  // Create a response instance we can mutate cookies on
  const res = NextResponse.next();

  // Use Supabase SSR client to reliably check auth session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isVerified = !!user?.email_confirmed_at;

  // If user is authenticated and trying to access home page, redirect to /learn
  if (isAuthenticated && isVerified && pathname === '/') {
    return NextResponse.redirect(new URL('/learn', request.url));
  }

  // Protected paths
  const protectedPaths = [
    '/learn',
    '/review',
    '/leaderboard',
    '/profile',
    '/quiz',
    '/lesson',
  ];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // If not authenticated, block protected pages, except during OAuth callback exchange
  // Redirect to home instead of login for a smoother logout experience
  if ((!isAuthenticated || !isVerified) && isProtected && !isOAuthCallback) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If authenticated, block auth pages
  if (
    isAuthenticated &&
    isVerified &&
    (pathname.startsWith('/auth/login') ||
      pathname.startsWith('/auth/register'))
  ) {
    return NextResponse.redirect(new URL('/learn', request.url));
  }

  return res;
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
