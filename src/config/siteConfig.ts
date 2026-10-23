import type { SiteAvailability, SocialLinks, NavLink } from '@/types'

// ─── Identity ────────────────────────────────────────────────────────────────
// Update these values with your real information before deploying.

export const siteConfig = {
  name: 'Your Name',
  title: 'Full-Stack Engineer',
  tagline: 'Building fast, accessible web products with React & Node.js',
  description:
    'Full-Stack Engineer specializing in React, Next.js, and Firebase. ' +
    'I design and ship end-to-end web applications with a focus on performance, ' +
    'accessibility, and developer experience.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev',
  location: 'Cairo, Egypt',
  timezone: 'Africa/Cairo',
  timezoneLabel: 'UTC+3',

  // ─── Availability ──────────────────────────────────────────────────────────
  // Change `status` to update the badge everywhere on the site.
  // "open"      → pulsing green dot
  // "selective" → yellow dot
  // "closed"    → red dot
  availability: {
    status: 'open',
    label: 'Open to full-time roles',
    arrangement: 'Remote · Hybrid',
  } satisfies SiteAvailability,

  // ─── Resume ────────────────────────────────────────────────────────────────
  // Upload your PDF to Cloudinary as a raw file and paste the URL here.
  // Updating your CV = replace this URL only. No redeploy needed.
  resumeUrl: 'https://res.cloudinary.com/pwwglm6s/raw/upload/portfolio/resume.pdf',
  resumeFilename: 'YourName_Resume_2026.pdf',

  // ─── Social Links ──────────────────────────────────────────────────────────
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
    email: 'hello@yourname.dev',
    calendly: 'https://calendly.com/yourusername/30min',
  } satisfies SocialLinks,

  // ─── Navigation ────────────────────────────────────────────────────────────
  nav: [
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Contact', href: '/#contact' },
  ] satisfies NavLink[],

  // ─── Open Graph ────────────────────────────────────────────────────────────
  ogImage: '/og-image.png',
  twitterHandle: '@yourusername',
} as const

export type SiteConfig = typeof siteConfig
