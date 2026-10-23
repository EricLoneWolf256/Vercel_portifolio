'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { Timestamp } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/firebase-admin'
import { requireAdminSession } from '@/lib/auth/session'
import type { AdminActionResult } from '@/lib/admin/types'

const ExperienceInputSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'), // "YYYY-MM-DD"
  endDate: z.string(), // "" means current
  location: z.string(),
  arrangement: z.enum(['remote', 'hybrid', 'onsite']),
  type: z.enum(['full-time', 'contract', 'freelance', 'internship']),
  bullets: z.array(z.string()),
  tech: z.array(z.string()),
  logoPublicId: z.string(),
  order: z.number(),
})

export type ExperienceInput = z.infer<typeof ExperienceInputSchema>

const COLLECTION = 'experience'

export async function saveExperience(id: string | null, data: ExperienceInput): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const parsed = ExperienceInputSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' }
  }

  const { startDate, endDate, ...rest } = parsed.data
  const doc = {
    ...rest,
    start: Timestamp.fromDate(new Date(startDate)),
    end: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
  }

  try {
    const db = getAdminDb()
    if (id) {
      await db.collection(COLLECTION).doc(id).set(doc, { merge: true })
    } else {
      await db.collection(COLLECTION).add(doc)
    }
  } catch (error) {
    console.error('[saveExperience]', error)
    return { success: false, error: 'Failed to save experience' }
  }

  revalidatePath('/')
  revalidatePath('/admin/experience')
  return { success: true }
}

export async function deleteExperience(id: string): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    await getAdminDb().collection(COLLECTION).doc(id).delete()
  } catch (error) {
    console.error('[deleteExperience]', error)
    return { success: false, error: 'Failed to delete experience' }
  }

  revalidatePath('/')
  revalidatePath('/admin/experience')
  return { success: true }
}
