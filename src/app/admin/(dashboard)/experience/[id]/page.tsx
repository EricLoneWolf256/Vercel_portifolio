import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAdminDb } from '@/lib/firebase-admin'
import { ExperienceForm } from '@/components/admin/ExperienceForm'
import type { Experience } from '@/types'

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const snap = await getAdminDb().collection('experience').doc(id).get()
  if (!snap.exists) notFound()

  const experience = { id: snap.id, ...snap.data() } as Experience

  return (
    <div className="space-y-6">
      <Link
        href="/admin/experience"
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to experience
      </Link>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Edit experience entry</h1>
      <ExperienceForm experience={experience} />
    </div>
  )
}
