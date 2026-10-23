'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Settings,
  FolderKanban,
  Briefcase,
  Sparkles,
  Quote,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoutButton } from './LogoutButton'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Sparkles },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
]

export function Sidebar({ email }: { email: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-6 px-2">
        <p className="font-display text-lg font-semibold text-[var(--text-primary)]">Admin</p>
        {email && <p className="truncate text-xs text-[var(--text-tertiary)]">{email}</p>}
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Admin navigation">
        {links.map((link) => {
          const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]',
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-[var(--border)] pt-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
        <LogoutButton />
      </div>
    </aside>
  )
}
