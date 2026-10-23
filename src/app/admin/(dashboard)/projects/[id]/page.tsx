import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAdminDb } from '@/lib/firebase-admin'
import { ProjectForm } from '@/components/admin/ProjectForm'
import type { Project } from '@/types'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const snap = await getAdminDb().collection('projects').doc(id).get()
  if (!snap.exists) notFound()

  const project = { id: snap.id, ...snap.data() } as Project

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Edit project</h1>
      <ProjectForm project={project} />
    </div>
  )
}
