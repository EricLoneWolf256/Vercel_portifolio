'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ExternalLink, CircleDot, Archive, Hammer } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
import { FadeUp } from '@/components/animations/FadeUp'
import { TechBadge } from '@/components/shared/TechBadge'
import { getCloudinaryUrl } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
import { siteConfig } from '@/config/siteConfig'

interface ProjectsSectionProps {
  projects: Project[]
}

const statusConfig = {
  live:        { label: 'Live',          icon: CircleDot, color: 'text-[var(--success)]' },
  development: { label: 'In Dev',        icon: Hammer,    color: 'text-[var(--warning)]' },
  archived:    { label: 'Archived',      icon: Archive,   color: 'text-[var(--text-tertiary)]' },
}

export function Projects({ projects }: ProjectsSectionProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
    return Array.from(tags).sort()
  }, [projects])

  // Filter
  const filtered = useMemo(
    () => (activeTag ? projects.filter((p) => p.tags?.includes(activeTag)) : projects),
    [projects, activeTag],
  )

  // Flagship projects get a larger spotlight treatment; everything else goes in the grid below.
  const featuredProjects = useMemo(() => projects.filter((p) => p.featured), [projects])
  const hasFeatured = featuredProjects.length > 0 && !activeTag
  const gridProjects = hasFeatured ? filtered.filter((p) => !p.featured) : filtered

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section-padding border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <FadeUp>
          <p className="font-mono text-sm text-[var(--accent)]">03. projects</p>
          <h2
            id="projects-heading"
            className="mt-2 font-display text-4xl font-semibold text-[var(--text-primary)]"
          >
            Things I&apos;ve Built
          </h2>
        </FadeUp>

        {/* Flagship projects — spotlight treatment */}
        {hasFeatured && (
          <div className="mt-10 flex flex-col gap-8">
            {featuredProjects.map((project, i) => {
              const imgUrl = project.imagePublicId
                ? getCloudinaryUrl(project.imagePublicId, { width: 900, height: 560, crop: 'fill' })
                : null
              const { icon: StatusIcon, label: statusLabel, color: statusColor } =
                statusConfig[project.status] ?? statusConfig.live

              return (
                <FadeUp key={project.id} delay={i * 0.1}>
                  <article
                    className={cn(
                      'group grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2',
                      'border border-[var(--border)] bg-[var(--surface)]',
                      'transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-lg',
                      i % 2 === 1 && 'lg:[&>*:first-child]:order-2',
                    )}
                  >
                    {imgUrl && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="block aspect-video overflow-hidden bg-[var(--surface-elevated)] lg:aspect-auto"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`${project.title} screenshot`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>
                    )}

                    <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                        Flagship project
                      </span>

                      <div>
                        <Link href={`/projects/${project.slug}`} className="group/title inline-flex items-center gap-1.5">
                          <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                            {project.title}
                          </h3>
                          <ArrowUpRight className="h-5 w-5 text-[var(--text-tertiary)] transition-transform group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:text-[var(--accent)]" />
                        </Link>
                        <span className={cn('mt-1 flex items-center gap-1 text-xs font-medium', statusColor)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusLabel}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {project.description}
                      </p>

                      {project.impact && (
                        <div className="w-fit rounded-lg bg-[var(--accent-muted)] px-3 py-2">
                          <p className="text-xs font-semibold text-[var(--accent)]">{project.impact}</p>
                        </div>
                      )}

                      {project.tech?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t) => (
                            <TechBadge key={t} label={t} size="sm" />
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                        >
                          Read case study →
                        </Link>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} GitHub repository`}
                            className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                            Code
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} live demo`}
                            className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </FadeUp>
              )
            })}
          </div>
        )}

        {hasFeatured && gridProjects.length > 0 && (
          <FadeUp delay={0.05}>
            <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
              More projects
            </p>
          </FadeUp>
        )}

        {/* Tag filter bar */}
        {allTags.length > 0 && (
          <FadeUp delay={0.1}>
            <div
              role="group"
              aria-label="Filter projects by technology"
              className="mt-8 flex flex-wrap gap-2"
            >
              <button
                onClick={() => setActiveTag(null)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                  activeTag === null
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50',
                )}
                aria-pressed={activeTag === null}
              >
                All ({projects.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                    activeTag === tag
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50',
                  )}
                  aria-pressed={activeTag === tag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </FadeUp>
        )}

        {/* Result count when filtered */}
        {activeTag && (
          <p className="mt-4 text-sm text-[var(--text-tertiary)]">
            Showing {gridProjects.length} of {projects.length} projects
          </p>
        )}

        {/* Grid */}
        <motion.div layout className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {gridProjects.map((project, i) => {
              const { icon: StatusIcon, label: statusLabel, color: statusColor } = statusConfig[project.status] ?? statusConfig.live
              const imgUrl = project.imagePublicId
                ? getCloudinaryUrl(project.imagePublicId, { width: 600, height: 340, crop: 'fill' })
                : null

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className={cn(
                    'group flex flex-col overflow-hidden rounded-2xl',
                    'border border-[var(--border)] bg-[var(--surface)]',
                    'transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-lg hover:-translate-y-0.5',
                  )}
                >
                  {/* Image */}
                  {imgUrl && (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="block aspect-video overflow-hidden bg-[var(--surface-elevated)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`${project.title} screenshot`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>
                  )}

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
                        >
                          {project.title}
                        </Link>
                        <span className={cn('mt-0.5 flex items-center gap-1 text-xs font-medium', statusColor)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusLabel}
                        </span>
                      </div>
                      <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
                        {project.role}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="flex-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Impact metric */}
                    {project.impact && (
                      <div className="rounded-lg bg-[var(--accent-muted)] px-3 py-2">
                        <p className="text-xs font-semibold text-[var(--accent)]">
                          {project.impact}
                        </p>
                      </div>
                    )}

                    {/* Tech stack */}
                    {project.tech?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 4).map((t) => (
                          <TechBadge key={t} label={t} size="sm" />
                        ))}
                        {project.tech.length > 4 && (
                          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-3 pt-1">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center gap-1.5 text-xs text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Case Study
                      </Link>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} GitHub repository`}
                          className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                          <GithubIcon className="h-3.5 w-3.5" />
                          Code
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live demo`}
                          className="flex items-center gap-1.5 text-xs text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {gridProjects.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--border)] p-12 text-center">
            <p className="text-[var(--text-tertiary)]">No projects match this filter.</p>
          </div>
        )}

        {/* View all on GitHub */}
        <FadeUp delay={0.3} className="mt-10 text-center">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            <GithubIcon className="h-4 w-4" />
            View all repositories on GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
