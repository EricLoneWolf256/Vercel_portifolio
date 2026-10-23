import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAdminDb } from '@/lib/firebase-admin'
import { SkillForm } from '@/components/admin/SkillForm'
import type { Skill } from '@/types'

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const snap = await getAdminDb().collection('skills').doc(id).get()
  if (!snap.exists) notFound()

  const skill = { id: snap.id, ...snap.data() } as Skill

  return (
    <div className="space-y-6">
      <Link
        href="/admin/skills"
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to skills
      </Link>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Edit skill</h1>
      <SkillForm skill={skill} />
    </div>
  )
}
