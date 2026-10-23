import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth/session'

// Optimistic check only (cookie presence, no signature verification) — this
// just keeps a logged-out visitor from ever seeing the dashboard shell.
// The real, secure check (verifySessionCookie against Firebase Auth) lives
// in `src/app/admin/(dashboard)/layout.tsx`, per the Next.js auth guide's
// recommended optimistic-in-proxy / secure-in-DAL split.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isGuardedAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'
  if (!isGuardedAdminRoute) return NextResponse.next()

  const hasSessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
