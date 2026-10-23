import { cn } from '@/lib/utils'

interface SectionKickerProps {
  number: string
  label: string
  className?: string
}

// A small bold-uppercase "stamp" badge — a solid cream fill, like the white
// vegan stamp on the brand reference, so it stays legible sitting directly
// on the bold coral page background rather than blending into it.
export function SectionKicker({ number, label, className }: SectionKickerProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-[var(--surface)] shadow-sm',
        'px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
      {number} &middot; {label}
    </span>
  )
}
