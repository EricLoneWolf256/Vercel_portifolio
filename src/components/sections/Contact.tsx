import { Mail, Calendar } from 'lucide-react'
import { FadeUp } from '@/components/animations/FadeUp'
import type { SiteSettings } from '@/types'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Contact({ settings }: { settings: SiteSettings }) {
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

        <FadeUp delay={0.1} className="mx-auto mt-12 max-w-md">
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
              I typically respond within 24 hours.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
