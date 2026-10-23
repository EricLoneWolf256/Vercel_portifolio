'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { ImageUploadField } from './ImageUploadField'
import { ResumeUploadField } from './ResumeUploadField'
import { updateSiteSettings, type SiteSettingsInput } from '@/app/admin/(dashboard)/settings/actions'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types'

const inputClass = cn(
  'w-full rounded-lg border bg-[var(--surface-elevated)] px-4 py-2.5 text-sm',
  'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
  'border-[var(--border)] outline-none',
  'transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
)

const labelClass = 'mb-1.5 block text-sm font-medium text-[var(--text-secondary)]'

const sectionClass = 'space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5'

const sectionTitleClass = 'font-display text-lg font-semibold text-[var(--text-primary)]'

interface FormValues {
  name: string
  title: string
  tagline: string
  description: string
  location: string
  timezone: string
  timezoneLabel: string
  avatarPublicId: string
  availabilityStatus: 'open' | 'selective' | 'closed'
  availabilityLabel: string
  availabilityArrangement: string
  resumeUrl: string
  resumeFilename: string
  socialGithub: string
  socialLinkedin: string
  socialTwitter: string
  socialEmail: string
  socialCalendly: string
  ogImage: string
  twitterHandle: string
  bioText: string
  stats: { label: string; value: string }[]
  valuesCsv: string
}

function toFormValues(settings: SiteSettings): FormValues {
  return {
    name: settings.name,
    title: settings.title,
    tagline: settings.tagline,
    description: settings.description,
    location: settings.location,
    timezone: settings.timezone,
    timezoneLabel: settings.timezoneLabel,
    avatarPublicId: settings.avatarPublicId,
    availabilityStatus: settings.availability.status,
    availabilityLabel: settings.availability.label,
    availabilityArrangement: settings.availability.arrangement,
    resumeUrl: settings.resumeUrl,
    resumeFilename: settings.resumeFilename,
    socialGithub: settings.social.github,
    socialLinkedin: settings.social.linkedin,
    socialTwitter: settings.social.twitter ?? '',
    socialEmail: settings.social.email,
    socialCalendly: settings.social.calendly ?? '',
    ogImage: settings.ogImage,
    twitterHandle: settings.twitterHandle,
    bioText: settings.about.bio.join('\n'),
    stats: settings.about.stats,
    valuesCsv: settings.about.values.join(', '),
  }
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter()
  const [avatarPublicId, setAvatarPublicId] = useState(settings.avatarPublicId)
  const [resumeUrl, setResumeUrl] = useState(settings.resumeUrl)

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: toFormValues(settings) })

  const { fields, append, remove } = useFieldArray({ control, name: 'stats' })

  const onSubmit = async (values: FormValues) => {
    const data: SiteSettingsInput = {
      name: values.name,
      title: values.title,
      tagline: values.tagline,
      description: values.description,
      location: values.location,
      timezone: values.timezone,
      timezoneLabel: values.timezoneLabel,
      avatarPublicId,
      availability: {
        status: values.availabilityStatus,
        label: values.availabilityLabel,
        arrangement: values.availabilityArrangement,
      },
      resumeUrl,
      resumeFilename: values.resumeFilename,
      social: {
        github: values.socialGithub,
        linkedin: values.socialLinkedin,
        twitter: values.socialTwitter,
        email: values.socialEmail,
        calendly: values.socialCalendly,
      },
      ogImage: values.ogImage,
      twitterHandle: values.twitterHandle,
      about: {
        bio: values.bioText.split('\n').map((s) => s.trim()).filter(Boolean),
        stats: values.stats.filter((s) => s.label.trim() && s.value.trim()),
        values: values.valuesCsv.split(',').map((s) => s.trim()).filter(Boolean),
      },
    }

    const result = await updateSiteSettings(data)
    if (result.success) {
      toast.success('Settings saved')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identity */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>Identity</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input {...register('name')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input {...register('title')} className={inputClass} placeholder="Full-Stack Engineer" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input {...register('tagline')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description (used for SEO)</label>
          <textarea {...register('description')} rows={3} className={cn(inputClass, 'resize-none')} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Location</label>
            <input {...register('location')} className={inputClass} placeholder="Cairo, Egypt" />
          </div>
          <div>
            <label className={labelClass}>Timezone (IANA)</label>
            <input {...register('timezone')} className={inputClass} placeholder="Africa/Cairo" />
          </div>
          <div>
            <label className={labelClass}>Timezone label</label>
            <input {...register('timezoneLabel')} className={inputClass} placeholder="UTC+3" />
          </div>
        </div>
        <ImageUploadField
          label="Avatar"
          folder="portfolio"
          value={avatarPublicId}
          onChange={setAvatarPublicId}
        />
      </div>

      {/* Availability */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>Availability</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Status</label>
            <select {...register('availabilityStatus')} className={cn(inputClass, 'cursor-pointer')}>
              <option value="open">Open</option>
              <option value="selective">Selective</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Label</label>
            <input {...register('availabilityLabel')} className={inputClass} placeholder="Open to full-time roles" />
          </div>
          <div>
            <label className={labelClass}>Arrangement</label>
            <input {...register('availabilityArrangement')} className={inputClass} placeholder="Remote · Hybrid" />
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>Resume</p>
        <ResumeUploadField value={resumeUrl} onChange={setResumeUrl} />
        <div>
          <label className={labelClass}>Download filename</label>
          <input {...register('resumeFilename')} className={inputClass} placeholder="YourName_Resume.pdf" />
        </div>
      </div>

      {/* Social */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>Social links</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input {...register('socialGithub')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input {...register('socialLinkedin')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Twitter / X URL (optional)</label>
            <input {...register('socialTwitter')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input {...register('socialEmail')} type="email" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Calendly URL (optional)</label>
            <input {...register('socialCalendly')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Twitter handle (for card attribution)</label>
            <input {...register('twitterHandle')} className={inputClass} placeholder="@yourusername" />
          </div>
        </div>
      </div>

      {/* About */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>About section</p>
        <div>
          <label className={labelClass}>Bio (one paragraph per line)</label>
          <textarea {...register('bioText')} rows={6} className={cn(inputClass, 'resize-none')} />
        </div>

        <div>
          <label className={labelClass}>Stats</label>
          <div className="space-y-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <input {...register(`stats.${i}.value`)} className={cn(inputClass, 'w-24')} placeholder="5+" />
                <input {...register(`stats.${i}.label`)} className={inputClass} placeholder="Years Experience" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-tertiary)] transition-colors hover:text-[var(--error)]"
                  aria-label="Remove stat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ label: '', value: '' })}
            className="mt-2 flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add stat
          </button>
        </div>

        <div>
          <label className={labelClass}>Values (comma-separated)</label>
          <input {...register('valuesCsv')} className={inputClass} placeholder="Clean code, Performance, Accessibility" />
        </div>
      </div>

      {/* SEO */}
      <div className={sectionClass}>
        <p className={sectionTitleClass}>SEO</p>
        <div>
          <label className={labelClass}>Open Graph image (path or URL)</label>
          <input {...register('ogImage')} className={inputClass} placeholder="/og-image.png" />
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
        {isSubmitting ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  )
}
