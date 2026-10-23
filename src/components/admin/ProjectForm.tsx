'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { ImageUploadField } from './ImageUploadField'
import { saveProject, type ProjectInput } from '@/app/admin/(dashboard)/projects/actions'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

const FormSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers, and hyphens only'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  impact: z.string(),
  techCsv: z.string(),
  tagsCsv: z.string(),
  github: z.string(),
  demo: z.string(),
  status: z.enum(['live', 'development', 'archived']),
  role: z.string(),
  featured: z.boolean(),
  imagePublicId: z.string(),
  order: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

const inputClass = cn(
  'w-full rounded-lg border bg-[var(--surface-elevated)] px-4 py-2.5 text-sm',
  'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
  'border-[var(--border)] outline-none',
  'transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
)

const labelClass = 'mb-1.5 block text-sm font-medium text-[var(--text-secondary)]'

function toCsv(items: string[]) {
  return items.join(', ')
}

function fromCsv(csv: string): string[] {
  return csv.split(',').map((s) => s.trim()).filter(Boolean)
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter()
  const [imagePublicId, setImagePublicId] = useState(project?.imagePublicId ?? '')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      slug: project?.slug ?? '',
      title: project?.title ?? '',
      description: project?.description ?? '',
      impact: project?.impact ?? '',
      techCsv: toCsv(project?.tech ?? []),
      tagsCsv: toCsv(project?.tags ?? []),
      github: project?.github ?? '',
      demo: project?.demo ?? '',
      status: project?.status ?? 'live',
      role: project?.role ?? '',
      featured: project?.featured ?? false,
      imagePublicId: project?.imagePublicId ?? '',
      order: String(project?.order ?? 0),
    },
  })

  const onSubmit = async (values: FormValues) => {
    const data: ProjectInput = {
      slug: values.slug,
      title: values.title,
      description: values.description,
      impact: values.impact,
      tech: fromCsv(values.techCsv),
      tags: fromCsv(values.tagsCsv),
      github: values.github,
      demo: values.demo,
      status: values.status,
      role: values.role,
      featured: values.featured,
      imagePublicId,
      order: Number(values.order) || 0,
    }

    const result = await saveProject(project?.id ?? null, data)
    if (result.success) {
      toast.success('Project saved')
      router.push('/admin/projects')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Title</label>
          <input {...register('title')} className={inputClass} placeholder="E-Commerce Platform" />
          {errors.title && <p className="mt-1 text-xs text-[var(--error)]">{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input {...register('slug')} className={inputClass} placeholder="ecommerce-platform" />
          {errors.slug && <p className="mt-1 text-xs text-[var(--error)]">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea {...register('description')} rows={3} className={cn(inputClass, 'resize-none')} />
        {errors.description && <p className="mt-1 text-xs text-[var(--error)]">{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Impact (optional)</label>
        <input {...register('impact')} className={inputClass} placeholder="10,000+ monthly active users" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Tech stack (comma-separated)</label>
          <input {...register('techCsv')} className={inputClass} placeholder="Next.js, TypeScript, Firebase" />
        </div>
        <div>
          <label className={labelClass}>Tags / filters (comma-separated)</label>
          <input {...register('tagsCsv')} className={inputClass} placeholder="Next.js, Full-Stack" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input {...register('github')} className={inputClass} placeholder="https://github.com/..." />
        </div>
        <div>
          <label className={labelClass}>Live demo URL</label>
          <input {...register('demo')} className={inputClass} placeholder="https://..." />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Status</label>
          <select {...register('status')} className={cn(inputClass, 'cursor-pointer')}>
            <option value="live">Live</option>
            <option value="development">In Dev</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Your role</label>
          <input {...register('role')} className={inputClass} placeholder="Solo project" />
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input {...register('order')} type="number" className={inputClass} />
        </div>
      </div>

      <Controller
        name="featured"
        control={control}
        render={({ field }) => (
          <label className="flex w-fit items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
            />
            Flagship project (shown in the spotlight section)
          </label>
        )}
      />

      <ImageUploadField
        label="Screenshot"
        folder="portfolio/projects"
        value={imagePublicId}
        onChange={setImagePublicId}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'flex items-center gap-2 rounded-lg px-5 py-2.5',
          'bg-[var(--accent)] text-white font-semibold text-sm',
          'transition-colors hover:bg-[var(--accent-hover)]',
          'disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isSubmitting ? 'Saving...' : 'Save project'}
      </button>
    </form>
  )
}
