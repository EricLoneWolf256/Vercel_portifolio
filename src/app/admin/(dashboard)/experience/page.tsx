import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { getExperience } from '@/lib/data/experience'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { formatDateRange } from '@/lib/utils'
import { deleteExperience } from './actions'

export default async function AdminExperiencePage() {
  const experience = await getExperience()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Experience</h1>
        <Link
          href="/admin/experience/new"
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          New entry
        </Link>
      </div>

      {experience.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">No experience entries yet.</p>
      ) : (
        <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {experience.map((job) => (
            <div key={job.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--text-primary)]">
                  {job.role} · {job.company}
                </p>
                <p className="truncate text-xs text-[var(--text-tertiary)]">
                  {formatDateRange(job.start, job.end)} · order {job.order}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-4">
                <Link
                  href={`/admin/experience/${job.id}`}
                  className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteExperience.bind(null, job.id)}
                  confirmMessage={`Delete "${job.role} at ${job.company}"? This cannot be undone.`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
