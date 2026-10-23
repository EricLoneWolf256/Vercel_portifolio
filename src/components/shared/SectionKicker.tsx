import { cn } from '@/lib/utils'

interface SectionKickerProps {
  number: string
  label: string
  className?: string
}

// A small bold-uppercase "stamp" badge — nods to the tracked-uppercase
// circular badges (100% VEGAN, GLUTEN FREE) on the brand reference.
export function SectionKicker({ number, label, className }: SectionKickerProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border-2 border-[var(--accent)]',
        'px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
      {number} &middot; {label}
    </span>
  )
}
