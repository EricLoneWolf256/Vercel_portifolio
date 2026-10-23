import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CircleDot, Hammer, Archive } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
import { getProjectBySlug, getProjects } from '@/lib/data/projects'
import { TechBadge } from '@/components/shared/TechBadge'
import { getCloudinaryUrl } from '@/lib/cloudinary'
import { siteConfig } from '@/config/siteConfig'
import { cn } from '@/lib/utils'

export const revalidate = 3600

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }

  const ogImage = project.imagePublicId
    ? getCloudinaryUrl(project.imagePublicId, { width: 1200, height: 630, crop: 'fill' })
    : undefined

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  }
}

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  live:        { label: 'Live',     icon: CircleDot, color: 'text-[var(--success)]' },
  development: { label: 'In Dev',   icon: Hammer,    color: 'text-[var(--warning)]' },
  archived:    { label: 'Archived', icon: Archive,   color: 'text-[var(--text-tertiary)]' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const { icon: StatusIcon, label: statusLabel, color: statusColor } =
    statusConfig[project.status] ?? statusConfig.live

  const heroImageUrl = project.imagePublicId
    ? getCloudinaryUrl(project.imagePublicId, { width: 1200, height: 630, crop: 'fill' })
    : null

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Back link */}
      <div className="mx-auto max-w-4xl px-4 pt-24 md:px-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={cn('flex items-center gap-1.5 text-sm font-medium', statusColor)}>
              <StatusIcon className="h-3.5 w-3.5" />
              {statusLabel}
            </span>
            <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--text-tertiary)]">
              {project.role}
            </span>
          </div>

          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] md:text-5xl">
            {project.title}
          </h1>

          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {project.description}
          </p>

          {/* Impact */}
          {project.impact && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-muted)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
              📈 {project.impact}
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              >
                <GithubIcon className="h-4 w-4" />
                View Code
              </a>
            )}
          </div>

          {/* Tech stack */}
          {project.tech?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tech.map((t) => (
                <TechBadge key={t} label={t} />
              ))}
            </div>
          )}
        </header>

        {/* Hero image */}
        {heroImageUrl && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--border)]">
            <Image
              src={heroImageUrl}
              alt={`${project.title} screenshot`}
              width={1200}
              height={630}
              priority
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Placeholder content area — replace with MDX in Phase 2 */}
        <div className="mt-12 space-y-8">
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
              Overview
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {project.description}
            </p>
          </section>

          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
            <p className="text-sm text-[var(--text-tertiary)]">
              Extended case study content coming in Phase 2 — powered by MDX.
            </p>
          </div>
        </div>
      </article>

      {/* Back to all projects */}
      <div className="border-t border-[var(--border)] py-12">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            View all projects
          </Link>
        </div>
      </div>
    </div>
  )
}
