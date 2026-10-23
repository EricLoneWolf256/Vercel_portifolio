import { getAdminDb } from '@/lib/firebase-admin'
import { MessageRow } from '@/components/admin/MessageRow'
import type { ContactSubmission } from '@/types'

export default async function AdminMessagesPage() {
  const snap = await getAdminDb().collection('contact_submissions').orderBy('createdAt', 'desc').get()
  const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactSubmission & { id: string })

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Messages</h1>

      {messages.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">No messages yet.</p>
      ) : (
        <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {messages.map((message) => (
            <MessageRow key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  )
}
