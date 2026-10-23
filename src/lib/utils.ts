import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  formatDistanceStrict,
  format,
  parseISO,
  isValid,
  differenceInMonths,
} from 'date-fns'
import type { Timestamp } from 'firebase/firestore'

// ─── Tailwind class merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date utilities ───────────────────────────────────────────────────────────

type TimestampLike = { toDate(): Date }

function hasToDate(value: unknown): value is TimestampLike {
  return typeof value === 'object' && value !== null && typeof (value as TimestampLike).toDate === 'function'
}

/**
 * Convert a Firestore Timestamp, Date, or ISO string to a JS Date.
 * Duck-types the Timestamp check (rather than `instanceof`) because the
 * client SDK (`firebase/firestore`) and Admin SDK (`firebase-admin/firestore`)
 * each have their own distinct `Timestamp` class — admin-read data (in
 * /admin pages) would otherwise fail an `instanceof` check against the
 * client class.
 */
export function toDate(value: Timestamp | Date | string | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) return isValid(value) ? value : null
  if (hasToDate(value)) return value.toDate()
  if (typeof value === 'string') {
    const d = parseISO(value)
    return isValid(d) ? d : null
  }
  return null
}

/**
 * Returns "Jan 2024" from a Timestamp, Date, or ISO string.
 */
export function formatDate(value: Timestamp | Date | string | null | undefined): string {
  const d = toDate(value)
  if (!d) return ''
  return format(d, 'MMM yyyy')
}

/**
 * Returns a human-readable duration, e.g. "1 yr 9 mos" or "8 mos".
 * Pass null for `end` to use today (current role).
 */
export function calcDuration(
  start: Timestamp | Date | string | null | undefined,
  end: Timestamp | Date | string | null | undefined,
): string {
  const startDate = toDate(start)
  const endDate = end ? toDate(end) : new Date()

  if (!startDate || !endDate) return ''

  const months = differenceInMonths(endDate, startDate)
  if (months < 1) return '< 1 mo'

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  const parts: string[] = []
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (remainingMonths > 0) parts.push(`${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`)

  return parts.join(' ')
}

/**
 * Returns "Jan 2024 – Present" or "Jan 2022 – Dec 2023 · 1 yr 11 mos"
 */
export function formatDateRange(
  start: Timestamp | Date | string | null | undefined,
  end: Timestamp | Date | string | null | undefined,
): string {
  const startStr = formatDate(start)
  const endStr = end ? formatDate(end) : 'Present'
  const duration = calcDuration(start, end)

  const range = `${startStr} – ${endStr}`
  return duration ? `${range} · ${duration}` : range
}

// ─── String utilities ─────────────────────────────────────────────────────────

/**
 * Truncates a string to `maxLength` and appends "…"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

/**
 * Converts a string to a URL-safe slug.
 * "Hello World" → "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
