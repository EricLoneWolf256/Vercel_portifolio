import { getTechIcon } from '@/lib/techIcons'

interface TechIconProps {
  name: string
  className?: string
}

// Renders a real brand logo (via simple-icons) in the current text color,
// so it stays consistent across the light/dark theme. Falls back to
// rendering nothing when the tech name isn't in the curated icon map —
// callers should keep their own text/initials fallback alongside this.
export function TechIcon({ name, className }: TechIconProps) {
  const icon = getTechIcon(name)
  if (!icon) return null

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-hidden
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}
