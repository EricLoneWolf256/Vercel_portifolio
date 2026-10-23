import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAdminDb } from '@/lib/firebase-admin'
import { TestimonialForm } from '@/components/admin/TestimonialForm'
import type { Testimonial } from '@/types'

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const snap = await getAdminDb().collection('testimonials').doc(id).get()
  if (!snap.exists) notFound()

  const testimonial = { id: snap.id, ...snap.data() } as Testimonial

  return (
    <div className="space-y-6">
      <Link
        href="/admin/testimonials"
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to testimonials
      </Link>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Edit testimonial</h1>
      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}
