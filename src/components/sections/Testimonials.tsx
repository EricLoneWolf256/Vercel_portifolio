import Image from 'next/image'
import { ExternalLink, Quote } from 'lucide-react'
import { FadeUp } from '@/components/animations/FadeUp'
import { getCloudinaryUrl } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="section-padding border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <FadeUp>
          <p className="font-mono text-sm text-[var(--accent)]">05. testimonials</p>
          <h2
            id="testimonials-heading"
            className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]"
          >
            What People Say
          </h2>
        </FadeUp>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => {
            const avatarUrl = t.avatarPublicId
              ? getCloudinaryUrl(t.avatarPublicId, { width: 64, height: 64, crop: 'fill', gravity: 'face', radius: 'max' })
              : null

            return (
              <FadeUp key={t.id} delay={i * 0.08}>
                <article
                  className={cn(
                    'flex h-full flex-col rounded-2xl p-6',
                    'border border-[var(--border)] bg-[var(--surface)]',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/30 hover:shadow-md',
                  )}
                >
                  {/* Quote icon */}
                  <Quote className="mb-4 h-6 w-6 text-[var(--accent)]/40" aria-hidden />

                  {/* Quote text */}
                  <blockquote className="flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* Attribution */}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={`${t.name} photo`}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--border)]"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-sm font-bold text-[var(--accent)]">
                          {t.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">
                          {t.title}, {t.company}
                        </p>
                      </div>
                    </div>
                    {t.linkedIn && (
                      <a
                        href={t.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${t.name}'s LinkedIn profile`}
                        className="text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent)]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
