'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, MailOpen, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { setMessageRead, deleteMessage } from '@/app/admin/(dashboard)/messages/actions'
import { toDate, cn } from '@/lib/utils'
import type { ContactSubmission } from '@/types'

const subjectLabel: Record<string, string> = {
  job: 'Job Opportunity',
  collaboration: 'Collaboration',
  project: 'Project Enquiry',
  other: 'Other',
}

export function MessageRow({ message }: { message: ContactSubmission & { id: string } }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function toggleRead() {
    startTransition(async () => {
      const result = await setMessageRead(message.id, !message.read)
      if (result.success) router.refresh()
      else toast.error(result.error)
    })
  }

  function handleDelete() {
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    startTransition(async () => {
      const result = await deleteMessage(message.id)
      if (result.success) {
        toast.success('Deleted')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const createdDate = toDate(message.createdAt)

  return (
    <div className={cn('p-4', !message.read && 'bg-[var(--accent)]/5')}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-[var(--text-primary)]">{message.name}</p>
            <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
              {subjectLabel[message.subject] ?? message.subject}
            </span>
            {!message.read && (
              <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
            )}
          </div>
          <a href={`mailto:${message.email}`} className="text-sm text-[var(--accent)] hover:underline">
            {message.email}
          </a>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--text-secondary)]">{message.message}</p>
          {createdDate && (
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">{format(createdDate, 'MMM d, yyyy · h:mm a')}</p>
          )}
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <button
            onClick={toggleRead}
            disabled={pending}
            className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {message.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
            {message.read ? 'Mark unread' : 'Mark read'}
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="flex items-center gap-1.5 text-sm text-[var(--error)] transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
