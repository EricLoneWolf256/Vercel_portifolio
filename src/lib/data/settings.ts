import { cache } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { siteConfig } from '@/config/siteConfig'
import type { SiteSettings } from '@/types'

const SETTINGS_DOC = 'settings/site'

// These are the defaults the site renders with before the owner has ever
// opened /admin/settings — mirrors what used to be hardcoded directly in
// each component. Once a `settings/site` Firestore doc exists, its fields
// override these one-by-one (partial docs are fine).
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: siteConfig.name,
  title: siteConfig.title,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  location: siteConfig.location,
  timezone: siteConfig.timezone,
  timezoneLabel: siteConfig.timezoneLabel,
  avatarPublicId: 'portfolio/avatar',
  availability: siteConfig.availability,
  resumeUrl: siteConfig.resumeUrl,
  resumeFilename: siteConfig.resumeFilename,
  social: siteConfig.social,
  ogImage: siteConfig.ogImage,
  twitterHandle: siteConfig.twitterHandle,
  about: {
    bio: [
      `I'm a Full-Stack Engineer based in ${siteConfig.location} with a passion for building web products that are fast, accessible, and genuinely useful. I care deeply about the craft — from clean API design to pixel-perfect UIs.`,
      'My background spans React, Next.js, Node.js, and Firebase. I\'ve worked across early-stage startups and larger product teams, shipping features end-to-end and owning the full development lifecycle from architecture to deployment.',
      'When I\'m not coding, I\'m writing about engineering, contributing to open-source, or exploring what\'s next in the web platform. I believe great software is built by people who communicate clearly and ship consistently.',
    ],
    stats: [
      { label: 'Years Experience', value: '5+' },
      { label: 'Projects Shipped', value: '20+' },
      { label: 'Open Source PRs', value: '50+' },
      { label: 'Happy Clients', value: '12' },
    ],
    values: ['Clean code', 'Performance', 'Accessibility', 'Clear comms', 'Shipping fast', 'User empathy'],
  },
}

function mergeSettings(data: Partial<SiteSettings> | undefined): SiteSettings {
  if (!data) return DEFAULT_SITE_SETTINGS

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...data,
    availability: { ...DEFAULT_SITE_SETTINGS.availability, ...data.availability },
    social: { ...DEFAULT_SITE_SETTINGS.social, ...data.social },
    about: {
      bio: data.about?.bio ?? DEFAULT_SITE_SETTINGS.about.bio,
      stats: data.about?.stats ?? DEFAULT_SITE_SETTINGS.about.stats,
      values: data.about?.values ?? DEFAULT_SITE_SETTINGS.about.values,
    },
  }
}

// Deduped per-request via React's cache() — layout.tsx and page.tsx each
// call this independently, but only one Firestore read happens per render.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const snap = await getDoc(doc(db, SETTINGS_DOC))
    if (!snap.exists()) return DEFAULT_SITE_SETTINGS
    return mergeSettings(snap.data() as Partial<SiteSettings>)
  } catch (error) {
    console.error('[getSiteSettings]', error)
    return DEFAULT_SITE_SETTINGS
  }
})
