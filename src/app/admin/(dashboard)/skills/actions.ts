'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getAdminDb } from '@/lib/firebase-admin'
import { requireAdminSession } from '@/lib/auth/session'
import type { AdminActionResult } from '@/lib/admin/types'

const SkillInputSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  icon: z.string(),
  level: z.enum(['expert', 'proficient', 'familiar']),
  order: z.number(),
})

export type SkillInput = z.infer<typeof SkillInputSchema>

const COLLECTION = 'skills'

export async function saveSkill(id: string | null, data: SkillInput): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const parsed = SkillInputSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' }
  }

  try {
    const db = getAdminDb()
    if (id) {
      await db.collection(COLLECTION).doc(id).set(parsed.data, { merge: true })
    } else {
      await db.collection(COLLECTION).add(parsed.data)
    }
  } catch (error) {
    console.error('[saveSkill]', error)
    return { success: false, error: 'Failed to save skill' }
  }

  revalidatePath('/')
  revalidatePath('/admin/skills')
  return { success: true }
}

export async function deleteSkill(id: string): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    await getAdminDb().collection(COLLECTION).doc(id).delete()
  } catch (error) {
    console.error('[deleteSkill]', error)
    return { success: false, error: 'Failed to delete skill' }
  }

  revalidatePath('/')
  revalidatePath('/admin/skills')
  return { success: true }
}
