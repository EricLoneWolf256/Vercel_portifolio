'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { AdminActionResult } from '@/lib/admin/types'

interface DeleteButtonProps {
  // Pass a bound Server Action, e.g. `deleteProject.bind(null, project.id)`
  action: () => Promise<AdminActionResult>
  confirmMessage?: string
  className?: string
}

export function DeleteButton({
  action,
  confirmMessage = 'Delete this? This cannot be undone.',
  className,
}: DeleteButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!window.confirm(confirmMessage)) return
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        toast.success('Deleted')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={cn(
        'flex items-center gap-1.5 text-sm text-[var(--error)] transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      Delete
    </button>
  )
}
