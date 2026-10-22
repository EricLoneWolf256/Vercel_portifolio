import { cn } from '@/lib/utils'

interface TechBadgeProps {
  label: string
  className?: string
  size?: 'sm' | 'md'
}

export function TechBadge({ label, className, size = 'md' }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-mono font-medium transition-colors',
        'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]',
        'hover:border-[var(--accent)] hover:text-[var(--text-primary)]',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        className,
      )}
    >
      {label}
    </span>
  )
}
