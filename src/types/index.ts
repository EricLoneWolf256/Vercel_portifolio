import { Timestamp } from 'firebase/firestore'

// ─── Project ────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  impact: string
  tech: string[]
  tags: string[]
  github: string
  demo: string
  status: 'live' | 'development' | 'archived'
  role: string
  featured: boolean
  imagePublicId: string
  order: number
}

// ─── Experience ──────────────────────────────────────────────────────────────

export interface Experience {
  id: string
  company: string
  role: string
  start: Timestamp | Date
  end: Timestamp | Date | null // null = current
  location: string
  arrangement: 'remote' | 'hybrid' | 'onsite'
  type: 'full-time' | 'contract' | 'freelance' | 'internship'
  bullets: string[]
  tech: string[]
  logoPublicId: string
  order: number
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export type SkillLevel = 'expert' | 'proficient' | 'familiar'

export interface Skill {
  id: string
  category: string
  name: string
  icon: string // simple-icons slug, e.g. "react", "typescript"
  level: SkillLevel
  order: number
}

export interface SkillCategory {
  category: string
  skills: Skill[]
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  quote: string
  name: string
  title: string
  company: string
  linkedIn: string
  avatarPublicId: string
  order: number
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface ContactSubmission {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  createdAt?: Timestamp | Date
  read?: boolean
  honeypot?: string // must be empty — spam trap
}

export type ContactStatus = 'idle' | 'loading' | 'success' | 'error'

// ─── Site Config ─────────────────────────────────────────────────────────────

export type AvailabilityStatus = 'open' | 'selective' | 'closed'

export interface SiteAvailability {
  status: AvailabilityStatus
  label: string
  arrangement: string
}

export interface SocialLinks {
  github: string
  linkedin: string
  twitter?: string
  email: string
  calendly?: string
}

export interface NavLink {
  label: string
  href: string
}

// ─── Site Settings (editable from /admin) ────────────────────────────────────

export interface AboutStat {
  label: string
  value: string
}

export interface AboutContent {
  bio: string[] // one paragraph per entry
  stats: AboutStat[]
  values: string[]
}

export interface SiteSettings {
  name: string
  title: string
  tagline: string
  description: string
  location: string
  timezone: string
  timezoneLabel: string
  avatarPublicId: string
  availability: SiteAvailability
  resumeUrl: string
  resumeFilename: string
  social: SocialLinks
  ogImage: string
  twitterHandle: string
  about: AboutContent
}
