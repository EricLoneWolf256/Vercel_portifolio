'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { Send, Mail, Calendar, Loader2, CheckCircle } from 'lucide-react'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
import { FadeUp } from '@/components/animations/FadeUp'
import { submitContact } from '@/app/actions/contact'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:    z.string().email('Please enter a valid email address'),
  subject:  z.enum(['job', 'collaboration', 'project', 'other']),
  message:  z.string().min(10, 'Message must be at least 10 characters').max(2000),
  honeypot: z.string().max(0),
})

type FormData = z.infer<typeof schema>

const subjectOptions = [
  { value: 'job',           label: 'Job Opportunity' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'project',       label: 'Project Enquiry' },
  { value: 'other',         label: 'Other' },
]

const inputBase = cn(
  'w-full rounded-lg border bg-[var(--surface-elevated)] px-4 py-2.5 text-sm',
  'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
  'border-[var(--border)] outline-none',
  'transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
)

export function Contact({ settings }: { settings: SiteSettings }) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: '' },
  })

  const onSubmit = async (data: FormData) => {
    const result = await submitContact(data)
    if (result.success) {
      setSubmitted(true)
      reset()
      toast.success('Message sent! I\'ll be in touch within 24 hours.')
    } else {
      toast.error(result.error ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-padding border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <FadeUp>
          <p className="font-mono text-sm text-[var(--accent)]">06. contact</p>
          <h2
            id="contact-heading"
            className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]"
          >
            Get In Touch
          </h2>
          <p className="mt-3 max-w-xl text-[var(--text-secondary)]">
            I&apos;m open to new opportunities and interesting projects. Whether it&apos;s a job
            offer, a collaboration, or just a chat — reach out.
          </p>
        </FadeUp>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left — direct contact methods */}
          <FadeUp delay={0.1} className="space-y-6">
            {/* Response time */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">Preferred Contact</p>
              <div className="space-y-3">
                {/* Email */}
                <a
                  href={`mailto:${settings.social.email}?subject=Opportunity%20at%20%5BCompany%5D`}
                  className="flex items-center gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-[var(--surface-elevated)]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                    <Mail className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Email</p>
                    <p className="text-[var(--text-tertiary)]">{settings.social.email}</p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-[var(--surface-elevated)]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                    <LinkedinIcon className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">LinkedIn</p>
                    <p className="text-[var(--text-tertiary)]">Send me a message</p>
                  </div>
                </a>

                {/* Calendly */}
                {settings.social.calendly && (
                  <a
                    href={settings.social.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-[var(--surface-elevated)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--success)]/10">
                      <Calendar className="h-4 w-4 text-[var(--success)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Book a call</p>
                      <p className="text-[var(--text-tertiary)]">30-min intro call</p>
                    </div>
                  </a>
                )}
              </div>
              <p className="mt-4 text-xs text-[var(--text-tertiary)]">
                ⚡ I typically respond within 24 hours.
              </p>
            </div>
          </FadeUp>

          {/* Right — contact form */}
          <FadeUp delay={0.2}>
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-10 text-center">
                <CheckCircle className="h-12 w-12 text-[var(--success)]" />
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">Message sent!</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-sm text-[var(--accent)] underline underline-offset-4 hover:no-underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4"
              >
                {/* Honeypot — hidden, must stay empty */}
                <input {...register('honeypot')} type="text" className="hidden" tabIndex={-1} aria-hidden />

                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Name <span aria-hidden className="text-[var(--error)]">*</span>
                  </label>
                  <input
                    {...register('name')}
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    className={cn(inputBase, errors.name && 'border-[var(--error)]')}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1 text-xs text-[var(--error)]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Email <span aria-hidden className="text-[var(--error)]">*</span>
                  </label>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={cn(inputBase, errors.email && 'border-[var(--error)]')}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-1 text-xs text-[var(--error)]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Subject <span aria-hidden className="text-[var(--error)]">*</span>
                  </label>
                  <select
                    {...register('subject')}
                    id="subject"
                    defaultValue=""
                    className={cn(inputBase, 'cursor-pointer', errors.subject && 'border-[var(--error)]')}
                    aria-invalid={!!errors.subject}
                  >
                    <option value="" disabled>Select a subject</option>
                    {subjectOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p role="alert" className="mt-1 text-xs text-[var(--error)]">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Message <span aria-hidden className="text-[var(--error)]">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className={cn(inputBase, 'resize-none', errors.message && 'border-[var(--error)]')}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" className="mt-1 text-xs text-[var(--error)]">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3',
                    'bg-[var(--accent)] text-white font-semibold text-sm',
                    'transition-all duration-200 hover:bg-[var(--accent-hover)]',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
