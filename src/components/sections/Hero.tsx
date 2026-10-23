'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowDown, Download } from 'lucide-react'
import { siteConfig } from '@/config/siteConfig'
import { getCloudinaryUrl } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'
import { ctaHover, iconHover } from '@/lib/motion'

// Social SVG icons (lucide-react dropped Github/Linkedin in recent versions)
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Hero() {
  const avatarUrl = getCloudinaryUrl('portfolio/avatar', {
    width: 160,
    height: 160,
    crop: 'fill',
    gravity: 'face',
    radius: 'max',
  })

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Subtle radial gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, var(--accent-muted) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 pb-16 pt-32 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]"
        >
          {/* Text content */}
          <div className="space-y-6">
            {/* Name */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="font-display text-hero font-semibold leading-none tracking-tight text-[var(--text-primary)]"
            >
              {siteConfig.name}
            </motion.h1>

            {/* Title + tagline */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="space-y-2"
            >
              <p className="text-2xl font-semibold text-[var(--accent)]">{siteConfig.title}</p>
              <p className="max-w-xl text-lg text-[var(--text-secondary)]">{siteConfig.tagline}</p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <motion.a
                {...ctaHover}
                href={siteConfig.resumeUrl}
                download={siteConfig.resumeFilename}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-5 py-2.5',
                  'border border-[var(--border)] bg-[var(--surface)]',
                  'text-sm font-semibold text-[var(--text-secondary)]',
                  'transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--text-primary)]',
                )}
              >
                <Download className="h-4 w-4" />
                Download Resume
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="flex items-center gap-3"
            >
              <motion.a
                {...iconHover}
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="inline-block text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <GithubIcon className="h-5 w-5" />
              </motion.a>
              <motion.a
                {...iconHover}
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="inline-block text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <LinkedinIcon className="h-5 w-5" />
              </motion.a>
            </motion.div>
          </div>

          {/* Avatar */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="h-40 w-40 overflow-hidden rounded-full ring-2 ring-[var(--border)] ring-offset-4 ring-offset-[var(--bg)]">
                <Image
                  src={avatarUrl}
                  alt={`${siteConfig.name} profile photo`}
                  width={160}
                  height={160}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              {siteConfig.availability.status === 'open' && (
                <span className="absolute bottom-2 right-2 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-[pulse-dot_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-[var(--success)] opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-[var(--success)] ring-2 ring-[var(--bg)]" />
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="/#about"
            aria-label="Scroll to about section"
            className="flex flex-col items-center gap-1 text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
          >
            <span>Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
