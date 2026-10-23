import Link from 'next/link'
import { FolderKanban, Briefcase, Sparkles, Quote, Mail, Settings } from 'lucide-react'
import { getAdminDb } from '@/lib/firebase-admin'

const cards = [
  { href: '/admin/settings', label: 'Site Settings', description: 'Identity, hero, about, SEO', icon: Settings },
  { href: '/admin/projects', label: 'Projects', description: 'Case studies shown on the homepage', icon: FolderKanban },
  { href: '/admin/experience', label: 'Experience', description: 'Work history timeline', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', description: 'Tech stack by category', icon: Sparkles },
  { href: '/admin/testimonials', label: 'Testimonials', description: 'Quotes from colleagues/clients', icon: Quote },
]

export default async function AdminDashboardPage() {
  let unreadCount = 0
  try {
    const snap = await getAdminDb().collection('contact_submissions').where('read', '==', false).get()
    unreadCount = snap.size
  } catch (error) {
    console.error('[AdminDashboardPage] unread count', error)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--text-tertiary)]">Everything on the site is editable from here.</p>
      </div>

      <Link
        href="/admin/messages"
        className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">Contact messages</p>
            <p className="text-sm text-[var(--text-tertiary)]">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </Link>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]/40"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{card.label}</p>
                <p className="text-sm text-[var(--text-tertiary)]">{card.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
