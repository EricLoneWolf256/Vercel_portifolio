import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getAuth } from 'firebase-admin/auth'
import { getAdminApp } from '@/lib/firebase-admin'
import { SESSION_COOKIE, ADMIN_EMAIL } from '@/lib/auth/session'

// 7 days, in milliseconds (what Admin SDK's createSessionCookie expects)
const EXPIRES_IN_MS = 60 * 60 * 24 * 7 * 1000

// Exchanges a freshly-signed-in Firebase ID token for an HttpOnly session
// cookie. Called by the admin login page right after signInWithPopup
// (Google) succeeds client-side.
export async function POST(request: NextRequest) {
  let idToken: string | undefined
  try {
    const body = await request.json()
    idToken = body?.idToken
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!idToken) {
    return NextResponse.json({ error: 'Missing idToken' }, { status: 400 })
  }

  try {
    const auth = getAuth(getAdminApp())

    // Google sign-in auto-creates a Firebase user for any Google account —
    // reject here, before a cookie is ever issued, for anyone but the one
    // allowed admin email.
    const decoded = await auth.verifyIdToken(idToken)
    if (decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'This Google account is not authorized for admin access.' },
        { status: 403 },
      )
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: EXPIRES_IN_MS / 1000,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/auth/session]', error)
    return NextResponse.json({ error: 'Invalid or expired login' }, { status: 401 })
  }
}

// Logout: clears the session cookie.
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return NextResponse.json({ success: true })
}
