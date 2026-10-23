import { FadeUp } from '@/components/animations/FadeUp'
import type { SiteSettings } from '@/types'

export function About({ settings }: { settings: SiteSettings }) {
  const { bio, stats, values } = settings.about

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <FadeUp>
          <p className="font-mono text-sm text-[var(--accent)]">01. about me</p>
          <h2
            id="about-heading"
            className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]"
          >
            Who I Am
          </h2>
        </FadeUp>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Bio */}
          <FadeUp delay={0.1} className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            {bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </FadeUp>

          {/* Stats */}
          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <p className="font-display text-3xl font-semibold text-[var(--accent)]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Values */}
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                What I value
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                {values.map((v) => (
                  <li key={v} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
