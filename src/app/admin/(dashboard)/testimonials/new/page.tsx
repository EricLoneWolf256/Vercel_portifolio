import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TestimonialForm } from '@/components/admin/TestimonialForm'

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/testimonials"
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to testimonials
      </Link>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">New testimonial</h1>
      <TestimonialForm />
    </div>
  )
}
