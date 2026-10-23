'use server'

import { getAdminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.enum(['job', 'collaboration', 'project', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  honeypot: z.string().max(0, 'Bot detected'), // must be empty
})

export type ContactFormData = z.infer<typeof ContactSchema>

export type ContactActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Partial<Record<keyof ContactFormData, string>> }

export async function submitContact(data: ContactFormData): Promise<ContactActionResult> {
  // Validate
  const parsed = ContactSchema.safeParse(data)
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactFormData
      fieldErrors[field] = issue.message
    }
    return { success: false, error: 'Validation failed', fieldErrors }
  }

  const { honeypot, ...submission } = parsed.data

  // Write to Firestore
  try {
    await getAdminDb().collection('contact_submissions').add({
      ...submission,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    })
    return { success: true }
  } catch (err) {
    console.error('[submitContact]', err)
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
