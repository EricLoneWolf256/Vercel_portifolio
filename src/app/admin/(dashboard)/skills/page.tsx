import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { getSkills } from '@/lib/data/skills'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteSkill } from './actions'

const levelLabel = { expert: 'Expert', proficient: 'Proficient', familiar: 'Familiar' }

export default async function AdminSkillsPage() {
  const categories = await getSkills()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          New skill
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">No skills yet.</p>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                {cat.category}
              </p>
              <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {cat.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--text-primary)]">{skill.name}</p>
                      <p className="truncate text-xs text-[var(--text-tertiary)]">
                        {levelLabel[skill.level]} · order {skill.order}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-4">
                      <Link
                        href={`/admin/skills/${skill.id}`}
                        className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteSkill.bind(null, skill.id)}
                        confirmMessage={`Delete "${skill.name}"? This cannot be undone.`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
