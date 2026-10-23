'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { ImageUploadField } from './ImageUploadField'
import { saveTestimonial, type TestimonialInput } from '@/app/admin/(dashboard)/testimonials/actions'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/types'

const FormSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  name: z.string().min(1, 'Name is required'),
  title: z.string(),
  company: z.string(),
  linkedIn: z.string(),
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

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter()
  const [avatarPublicId, setAvatarPublicId] = useState(testimonial?.avatarPublicId ?? '')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      quote: testimonial?.quote ?? '',
      name: testimonial?.name ?? '',
      title: testimonial?.title ?? '',
      company: testimonial?.company ?? '',
      linkedIn: testimonial?.linkedIn ?? '',
      order: String(testimonial?.order ?? 0),
    },
  })

  const onSubmit = async (values: FormValues) => {
    const data: TestimonialInput = {
      quote: values.quote,
      name: values.name,
      title: values.title,
      company: values.company,
      linkedIn: values.linkedIn,
      avatarPublicId,
      order: Number(values.order) || 0,
    }

    const result = await saveTestimonial(testimonial?.id ?? null, data)
    if (result.success) {
      toast.success('Testimonial saved')
      router.push('/admin/testimonials')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label className={labelClass}>Quote</label>
        <textarea {...register('quote')} rows={4} className={cn(inputClass, 'resize-none')} />
        {errors.quote && <p className="mt-1 text-xs text-[var(--error)]">{errors.quote.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input {...register('name')} className={inputClass} placeholder="Sarah Johnson" />
          {errors.name && <p className="mt-1 text-xs text-[var(--error)]">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Title</label>
          <input {...register('title')} className={inputClass} placeholder="Engineering Manager" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Company</label>
          <input {...register('company')} className={inputClass} placeholder="Acme Corp" />
        </div>
        <div>
          <label className={labelClass}>LinkedIn URL (optional)</label>
          <input {...register('linkedIn')} className={inputClass} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      <div>
        <label className={labelClass}>Order</label>
        <input {...register('order')} type="number" className={cn(inputClass, 'max-w-32')} />
      </div>

      <ImageUploadField
        label="Avatar"
        folder="portfolio/avatars"
        value={avatarPublicId}
        onChange={setAvatarPublicId}
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
        {isSubmitting ? 'Saving...' : 'Save testimonial'}
      </button>
    </form>
  )
}
