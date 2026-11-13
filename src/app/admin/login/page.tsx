'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { Loader2, Lock } from 'lucide-react'
import { getFirebaseAuth } from '@/lib/firebase'
import { cn } from '@/lib/utils'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

const inputClass = cn(
  'w-full rounded-lg border bg-[var(--surface-elevated)] px-4 py-2.5 text-sm',
  'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
  'border-[var(--border)] outline-none',
  'transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
)

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Shared by both sign-in methods — the server only cares about the
  // resulting ID token's email claim (checked against ADMIN_EMAIL), not
  // which Firebase Auth provider produced it.
  async function exchangeForSession(idToken: string) {
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.error ?? 'Sign-in failed.')
    }

    router.push('/admin')
    router.refresh()
  }

  async function onGoogleSignIn() {
    setError(null)
    setGoogleLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const credential = await signInWithPopup(getFirebaseAuth(), provider)
      const idToken = await credential.user.getIdToken()
      await exchangeForSession(idToken)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
      setGoogleLoading(false)
    }
  }

  async function onPasswordSignIn(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPasswordLoading(true)

    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
      const idToken = await credential.user.getIdToken()
      await exchangeForSession(idToken)
    } catch {
      setError('Invalid email or password.')
      setPasswordLoading(false)
    }
  }

  const loading = googleLoading || passwordLoading

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-[var(--text-primary)]">
              Admin sign in
            </h1>
            <p className="mt-1 text-sm text-[var(--text-tertiary)]">
              Manage this site&apos;s content
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <button
            onClick={onGoogleSignIn}
            disabled={loading}
            className={cn(
              'flex w-full items-center justify-center gap-2.5 rounded-lg px-5 py-2.5',
              'border border-[var(--border)] bg-[var(--surface-elevated)]',
              'font-semibold text-sm text-[var(--text-primary)]',
              'transition-colors hover:border-[var(--accent)]',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-tertiary)]">or</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <form onSubmit={onPasswordSignIn} className="space-y-3">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5',
                'bg-[var(--accent)] text-white font-semibold text-sm',
                'transition-colors hover:bg-[var(--accent-hover)]',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {passwordLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {error && (
            <p role="alert" className="text-center text-sm text-[var(--error)]">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
