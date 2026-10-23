'use server'

import { revalidatePath } from 'next/cache'
import { getAdminDb } from '@/lib/firebase-admin'
import { requireAdminSession } from '@/lib/auth/session'
import type { AdminActionResult } from '@/lib/admin/types'

const COLLECTION = 'contact_submissions'

export async function setMessageRead(id: string, read: boolean): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    await getAdminDb().collection(COLLECTION).doc(id).update({ read })
  } catch (error) {
    console.error('[setMessageRead]', error)
    return { success: false, error: 'Failed to update message' }
  }

  revalidatePath('/admin/messages')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteMessage(id: string): Promise<AdminActionResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  try {
    await getAdminDb().collection(COLLECTION).doc(id).delete()
  } catch (error) {
    console.error('[deleteMessage]', error)
    return { success: false, error: 'Failed to delete message' }
  }

  revalidatePath('/admin/messages')
  revalidatePath('/admin')
  return { success: true }
}
