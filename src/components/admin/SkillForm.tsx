'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { saveSkill, type SkillInput } from '@/app/admin/(dashboard)/skills/actions'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

const FormSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  icon: z.string(),
  level: z.enum(['expert', 'proficient', 'familiar']),
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

export function SkillForm({ skill }: { skill?: Skill }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: skill?.category ?? '',
      name: skill?.name ?? '',
      icon: skill?.icon ?? '',
      level: skill?.level ?? 'proficient',
      order: String(skill?.order ?? 0),
    },
  })

  const onSubmit = async (values: FormValues) => {
    const data: SkillInput = {
      category: values.category,
      name: values.name,
      icon: values.icon,
      level: values.level,
      order: Number(values.order) || 0,
    }

    const result = await saveSkill(skill?.id ?? null, data)
    if (result.success) {
      toast.success('Skill saved')
      router.push('/admin/skills')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Category</label>
          <input {...register('category')} className={inputClass} placeholder="Frameworks" />
          {errors.category && <p className="mt-1 text-xs text-[var(--error)]">{errors.category.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Name</label>
          <input {...register('name')} className={inputClass} placeholder="React" />
          {errors.name && <p className="mt-1 text-xs text-[var(--error)]">{errors.name.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Icon slug (optional)</label>
        <input {...register('icon')} className={inputClass} placeholder="react" />
        <p className="mt-1 text-xs text-[var(--text-tertiary)]">
          Matched against the site&apos;s tech-logo list by name automatically — this field is informational only.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Proficiency</label>
          <select {...register('level')} className={cn(inputClass, 'cursor-pointer')}>
            <option value="expert">Expert</option>
            <option value="proficient">Proficient</option>
            <option value="familiar">Familiar</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input {...register('order')} type="number" className={inputClass} />
        </div>
      </div>

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
        {isSubmitting ? 'Saving...' : 'Save skill'}
      </button>
    </form>
  )
}
