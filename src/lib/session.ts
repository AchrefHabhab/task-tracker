import { cookies } from 'next/headers';

const COOKIE_NAME = 'task-tracker-session';

/**
 * Read the session ID from the cookie set by middleware.
 * Middleware guarantees the cookie exists before this runs.
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionId) {
    throw new Error('Session cookie missing — middleware should have set it.');
  }

  return sessionId;
}
