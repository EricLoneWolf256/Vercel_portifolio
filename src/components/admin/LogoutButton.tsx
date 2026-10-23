'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { LogOut, Loader2 } from 'lucide-react'
import { getFirebaseAuth } from '@/lib/firebase'
import { cn } from '@/lib/utils'

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onLogout() {
    setLoading(true)
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
      await signOut(getFirebaseAuth())
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
        'text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Log out
    </button>
  )
}
