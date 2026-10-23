'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getAdminDb } from '@/lib/firebase-admin'
import { requireAdminSession } from '@/lib/auth/session'
import type { AdminActionResult } from '@/lib/admin/types'

const SiteSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  tagline: z.string(),
  description: z.string(),
  location: z.string(),
  timezone: z.string(),
  timezoneLabel: z.string(),
  avatarPublicId: z.string(),
  availability: z.object({
    status: z.enum(['open', 'selective', 'closed']),
    label: z.string(),
    arrangement: z.string(),
  }),
  resumeUrl: z.string(),
  resumeFilename: z.string(),
  social: z.object({
    github: z.string(),
    linkedin: z.string(),
    twitter: z.string(),
    email: z.string(),
    calendly: z.string(),
  }),
  ogImage: z.string(),
  twitterHandle: z.string(),
  about: z.object({
    bio: z.array(z.string()),
    stats: z.array(z.object({ label: z.string(), value: z.string() })),
    values: z.array(z.string()),
  }),
})

export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>

export async function updateSiteSettings(data: SiteSettingsInput): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const parsed = SiteSettingsSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' }
  }

  try {
    await getAdminDb().collection('settings').doc('site').set(parsed.data, { merge: true })
  } catch (error) {
    console.error('[updateSiteSettings]', error)
    return { success: false, error: 'Failed to save settings' }
  }

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}
