import { cn } from '@/lib/utils'
import type { AvailabilityStatus } from '@/types'

interface AvailabilityBadgeProps {
  status: AvailabilityStatus
  label: string
  arrangement?: string
  className?: string
  /** If true, clicking scrolls to #contact */
  interactive?: boolean
}

const config: Record<AvailabilityStatus, { color: string; dot: string }> = {
  open: {
    color: 'text-[var(--success)] border-[var(--success)]/30 bg-[var(--success)]/10',
    dot: 'bg-[var(--success)]',
  },
  selective: {
    color: 'text-[var(--warning)] border-[var(--warning)]/30 bg-[var(--warning)]/10',
    dot: 'bg-[var(--warning)]',
  },
  closed: {
    color: 'text-[var(--error)] border-[var(--error)]/30 bg-[var(--error)]/10',
    dot: 'bg-[var(--error)]',
  },
}

export function AvailabilityBadge({
  status,
  label,
  arrangement,
  className,
  interactive = true,
}: AvailabilityBadgeProps) {
  const { color, dot } = config[status]

  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium',
        color,
        className,
      )}
    >
      {/* Pulsing dot — only when open */}
      <span className="relative flex h-2 w-2 flex-shrink-0">
        {status === 'open' && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-[pulse-dot_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full opacity-75',
              dot,
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', dot)} />
      </span>
      <span>{label}</span>
      {arrangement && (
        <>
          <span className="opacity-40">·</span>
          <span className="text-xs opacity-70">{arrangement}</span>
        </>
      )}
    </span>
  )

  if (interactive) {
    return (
      <a href="/#contact" aria-label={`Availability: ${label}. Click to go to contact section.`}>
        {content}
      </a>
    )
  }

  return content
}
