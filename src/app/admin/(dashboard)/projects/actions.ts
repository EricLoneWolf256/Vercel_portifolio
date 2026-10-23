'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getAdminDb } from '@/lib/firebase-admin'
import { requireAdminSession } from '@/lib/auth/session'
import type { AdminActionResult } from '@/lib/admin/types'

const ProjectInputSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  impact: z.string(),
  tech: z.array(z.string()),
  tags: z.array(z.string()),
  github: z.string(),
  demo: z.string(),
  status: z.enum(['live', 'development', 'archived']),
  role: z.string(),
  featured: z.boolean(),
  imagePublicId: z.string(),
  order: z.number(),
})

export type ProjectInput = z.infer<typeof ProjectInputSchema>

const COLLECTION = 'projects'

export async function saveProject(id: string | null, data: ProjectInput): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const parsed = ProjectInputSchema.safeParse(data)
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
    console.error('[saveProject]', error)
    return { success: false, error: 'Failed to save project' }
  }

  revalidatePath('/')
  revalidatePath(`/projects/${parsed.data.slug}`)
  revalidatePath('/admin/projects')
  return { success: true }
}

export async function deleteProject(id: string): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    await getAdminDb().collection(COLLECTION).doc(id).delete()
  } catch (error) {
    console.error('[deleteProject]', error)
    return { success: false, error: 'Failed to delete project' }
  }

  revalidatePath('/')
  revalidatePath('/admin/projects')
  return { success: true }
}
