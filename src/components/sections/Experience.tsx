import Image from 'next/image'
import { MapPin, Wifi, Building2, Briefcase } from 'lucide-react'
import { FadeUp } from '@/components/animations/FadeUp'
import { TechBadge } from '@/components/shared/TechBadge'
import { getCloudinaryUrl } from '@/lib/cloudinary'
import { formatDate, formatDateRange } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Experience } from '@/types'

interface ExperienceSectionProps {
  experience: Experience[]
}

const arrangementIcon = {
  remote: Wifi,
  hybrid: Building2,
  onsite: MapPin,
}

const typeLabel = {
  'full-time': 'Full-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
}

export function Experience({ experience }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="section-padding border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <FadeUp>
          <p className="font-mono text-sm text-[var(--accent)]">04. experience</p>
          <h2
            id="experience-heading"
            className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]"
          >
            Where I&apos;ve Worked
          </h2>
        </FadeUp>

        {experience.length === 0 ? (
          <FadeUp delay={0.1}>
            <div className="mt-12 rounded-xl border border-dashed border-[var(--border)] p-12 text-center">
              <p className="text-[var(--text-tertiary)]">
                Add experience to Firestore <code className="font-mono text-xs">/experience</code> to see it here.
              </p>
            </div>
          </FadeUp>
        ) : (
          <div className="mt-12 relative">
            {/* Vertical line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)] md:left-6"
              aria-hidden
            />

            <div className="flex flex-col gap-10">
              {experience.map((job, i) => {
                const ArrangementIcon = arrangementIcon[job.arrangement] ?? MapPin
                const logoUrl = job.logoPublicId
                  ? getCloudinaryUrl(job.logoPublicId, { width: 48, height: 48, crop: 'fill' })
                  : null

                return (
                  <FadeUp key={job.id} delay={i * 0.1}>
                    <article className="relative pl-14 md:pl-20">
                      {/* Timeline dot with logo */}
                      <div
                        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface)] md:left-1.5"
                        aria-hidden
                      >
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={`${job.company} logo`}
                            width={24}
                            height={24}
                            className="h-5 w-5 rounded-full object-contain"
                          />
                        ) : (
                          <Briefcase className="h-4 w-4 text-[var(--text-tertiary)]" />
                        )}
                      </div>

                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]/30">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] text-lg">
                              {job.role}
                            </h3>
                            <p className="text-[var(--accent)] font-medium">{job.company}</p>
                          </div>
                          <div className="text-right text-sm text-[var(--text-tertiary)]">
                            <p className="font-mono">{formatDateRange(job.start, job.end)}</p>
                            <span className="mt-1 inline-block rounded-full border border-[var(--border)] px-2 py-0.5 text-xs">
                              {typeLabel[job.type] ?? job.type}
                            </span>
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--text-tertiary)]">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <ArrangementIcon className="h-3 w-3" />
                            {job.arrangement.charAt(0).toUpperCase() + job.arrangement.slice(1)}
                          </span>
                        </div>

                        {/* Bullets */}
                        {job.bullets?.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {job.bullets.map((bullet, bi) => (
                              <li key={bi} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Tech used */}
                        {job.tech?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {job.tech.map((t) => (
                              <TechBadge key={t} label={t} size="sm" />
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </FadeUp>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
