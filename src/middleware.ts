import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'task-tracker-session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Ensures every visitor has a session cookie.
 * First visit: set cookie + redirect so the page can read it.
 * Subsequent visits: pass through.
 */
export function middleware(request: NextRequest) {
  const existing = request.cookies.get(COOKIE_NAME)?.value;

  if (existing) return NextResponse.next();

  // New visitor — set cookie and redirect to same path
  const sessionId = crypto.randomUUID();
  const response = NextResponse.redirect(request.nextUrl);

  response.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
