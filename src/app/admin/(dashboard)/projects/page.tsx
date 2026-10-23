import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { getProjects } from '@/lib/data/projects'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteProject } from './actions'

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">No projects yet. Create your first one above.</p>
      ) : (
        <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--text-primary)]">
                  {project.title}
                  {project.featured && (
                    <span className="ml-2 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                      Flagship
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-[var(--text-tertiary)]">/{project.slug} · order {project.order}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-4">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteProject.bind(null, project.id)}
                  confirmMessage={`Delete "${project.title}"? This cannot be undone.`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
