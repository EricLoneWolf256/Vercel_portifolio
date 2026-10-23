import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { getAuth } from 'firebase-admin/auth'
import { getAdminApp } from '@/lib/firebase-admin'

export const SESSION_COOKIE = 'session'

// Google sign-in auto-creates a Firebase user for *any* Google account on
// first login — Firebase itself doesn't gate who can sign in. This is the
// actual access-control boundary: only this email is treated as an admin,
// everyone else is rejected post-sign-in (both when the session cookie is
// first issued, and again here on every subsequent check).
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'innocentericmuzamil@gmail.com'

export interface AdminSession {
  uid: string
  email: string | null
}

/**
 * Secure session check — verifies the session cookie's signature and
 * expiry against Firebase Auth, and that it belongs to the one allowed
 * admin email. Use this in layouts/pages/Server Actions that actually gate
 * data, not just `proxy.ts`'s optimistic check.
 */
export const verifySession = cache(async (): Promise<AdminSession | null> => {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionCookie) return null

  try {
    const decoded = await getAuth(getAdminApp()).verifySessionCookie(sessionCookie, true)
    if (decoded.email !== ADMIN_EMAIL) return null
    return { uid: decoded.uid, email: decoded.email ?? null }
  } catch {
    return null
  }
})

/** Throws-free helper for Server Actions: returns the session or null, never redirects. */
export async function requireAdminSession(): Promise<AdminSession | null> {
  return verifySession()
}
