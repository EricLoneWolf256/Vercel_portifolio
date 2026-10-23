'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { ImageUploadField } from './ImageUploadField'
import { saveExperience, type ExperienceInput } from '@/app/admin/(dashboard)/experience/actions'
import { toDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Experience } from '@/types'

const FormSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  current: z.boolean(),
  endDate: z.string(),
  location: z.string(),
  arrangement: z.enum(['remote', 'hybrid', 'onsite']),
  type: z.enum(['full-time', 'contract', 'freelance', 'internship']),
  bulletsText: z.string(),
  techCsv: z.string(),
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

function toDateInputValue(value: Experience['start'] | Experience['end'] | undefined): string {
  const d = toDate(value)
  return d ? format(d, 'yyyy-MM-dd') : ''
}

function fromCsv(csv: string): string[] {
  return csv.split(',').map((s) => s.trim()).filter(Boolean)
}

function fromLines(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean)
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const router = useRouter()
  const [logoPublicId, setLogoPublicId] = useState(experience?.logoPublicId ?? '')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company: experience?.company ?? '',
      role: experience?.role ?? '',
      startDate: toDateInputValue(experience?.start),
      current: experience ? experience.end === null : true,
      endDate: toDateInputValue(experience?.end),
      location: experience?.location ?? '',
      arrangement: experience?.arrangement ?? 'remote',
      type: experience?.type ?? 'full-time',
      bulletsText: (experience?.bullets ?? []).join('\n'),
      techCsv: (experience?.tech ?? []).join(', '),
      order: String(experience?.order ?? 0),
    },
  })

  const isCurrent = watch('current')

  const onSubmit = async (values: FormValues) => {
    const data: ExperienceInput = {
      company: values.company,
      role: values.role,
      startDate: values.startDate,
      endDate: values.current ? '' : values.endDate,
      location: values.location,
      arrangement: values.arrangement,
      type: values.type,
      bullets: fromLines(values.bulletsText),
      tech: fromCsv(values.techCsv),
      logoPublicId,
      order: Number(values.order) || 0,
    }

    const result = await saveExperience(experience?.id ?? null, data)
    if (result.success) {
      toast.success('Experience saved')
      router.push('/admin/experience')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Company</label>
          <input {...register('company')} className={inputClass} placeholder="Acme Corp" />
          {errors.company && <p className="mt-1 text-xs text-[var(--error)]">{errors.company.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input {...register('role')} className={inputClass} placeholder="Senior Frontend Engineer" />
          {errors.role && <p className="mt-1 text-xs text-[var(--error)]">{errors.role.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Start date</label>
          <input {...register('startDate')} type="date" className={inputClass} />
          {errors.startDate && <p className="mt-1 text-xs text-[var(--error)]">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className={labelClass}>End date</label>
          <input {...register('endDate')} type="date" disabled={isCurrent} className={cn(inputClass, 'disabled:opacity-50')} />
          <Controller
            name="current"
            control={control}
            render={({ field }) => (
              <label className="mt-2 flex w-fit items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
                />
                This is my current role
              </label>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Location</label>
          <input {...register('location')} className={inputClass} placeholder="Cairo, Egypt" />
        </div>
        <div>
          <label className={labelClass}>Arrangement</label>
          <select {...register('arrangement')} className={cn(inputClass, 'cursor-pointer')}>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select {...register('type')} className={cn(inputClass, 'cursor-pointer')}>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Highlights (one per line)</label>
        <textarea {...register('bulletsText')} rows={5} className={cn(inputClass, 'resize-none')} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Tech used (comma-separated)</label>
          <input {...register('techCsv')} className={inputClass} placeholder="React, TypeScript, AWS" />
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input {...register('order')} type="number" className={inputClass} />
        </div>
      </div>

      <ImageUploadField
        label="Company logo"
        folder="portfolio/logos"
        value={logoPublicId}
        onChange={setLogoPublicId}
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
        {isSubmitting ? 'Saving...' : 'Save experience'}
      </button>
    </form>
  )
}
