import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { getTestimonials } from '@/lib/data/testimonials'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteTestimonial } from './actions'

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          New testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">No testimonials yet.</p>
      ) : (
        <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--text-primary)]">{t.name}</p>
                <p className="truncate text-xs text-[var(--text-tertiary)]">
                  {t.title}, {t.company} · order {t.order}
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-4">
                <Link
                  href={`/admin/testimonials/${t.id}`}
                  className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <DeleteButton
                  action={deleteTestimonial.bind(null, t.id)}
                  confirmMessage={`Delete the testimonial from "${t.name}"? This cannot be undone.`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
