'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getAdminDb } from '@/lib/firebase-admin'
import { requireAdminSession } from '@/lib/auth/session'
import type { AdminActionResult } from '@/lib/admin/types'

const TestimonialInputSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  name: z.string().min(1, 'Name is required'),
  title: z.string(),
  company: z.string(),
  linkedIn: z.string(),
  avatarPublicId: z.string(),
  order: z.number(),
})

export type TestimonialInput = z.infer<typeof TestimonialInputSchema>

const COLLECTION = 'testimonials'

export async function saveTestimonial(id: string | null, data: TestimonialInput): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const parsed = TestimonialInputSchema.safeParse(data)
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
    console.error('[saveTestimonial]', error)
    return { success: false, error: 'Failed to save testimonial' }
  }

  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

export async function deleteTestimonial(id: string): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    await getAdminDb().collection(COLLECTION).doc(id).delete()
  } catch (error) {
    console.error('[deleteTestimonial]', error)
    return { success: false, error: 'Failed to delete testimonial' }
  }

  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}
