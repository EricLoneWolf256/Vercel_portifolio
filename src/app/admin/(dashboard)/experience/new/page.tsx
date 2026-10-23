import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ExperienceForm } from '@/components/admin/ExperienceForm'

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/experience"
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to experience
      </Link>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">New experience entry</h1>
      <ExperienceForm />
    </div>
  )
}
