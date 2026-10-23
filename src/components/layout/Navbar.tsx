'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { MobileNav } from './MobileNav'
import { siteConfig } from '@/config/siteConfig'
import { cn } from '@/lib/utils'
import { ctaHover, pillHover } from '@/lib/motion'

const MotionLink = motion.create(Link)

// Extracts the anchor id from href like "/#about" → "about"
function getAnchorId(href: string) {
  const match = href.match(/#(.+)$/)
  return match ? match[1] : null
}

export function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Track scroll for background blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection Observer for active section highlight
  useEffect(() => {
    const ids = siteConfig.nav.map((l) => getAnchorId(l.href)).filter(Boolean) as string[]
    const observers: IntersectionObserver[] = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          scrolled
            ? 'border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md'
            : 'bg-transparent',
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8"
          aria-label="Primary navigation"
        >
          {/* Logo / Name */}
          <Link
            href="/"
            className="font-display text-lg font-semibold text-[var(--text-primary)] transition-opacity hover:opacity-70"
            aria-label={`${siteConfig.name} — home`}
          >
            {siteConfig.name}
          </Link>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-1 md:flex" role="list">
            {siteConfig.nav.map((link) => {
              const anchorId = getAnchorId(link.href)
              const isActive = anchorId ? activeSection === anchorId : false
              return (
                <li key={link.href}>
                  <MotionLink
                    {...pillHover}
                    href={link.href}
                    className={cn(
                      'relative block px-3 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-[var(--surface-elevated)]"
                        style={{ zIndex: -1 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                      />
                    )}
                  </MotionLink>
                </li>
              )
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Resume — desktop */}
            <motion.a
              {...ctaHover}
              href={siteConfig.resumeUrl}
              download={siteConfig.resumeFilename}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'hidden md:flex items-center gap-1.5 rounded-lg border px-3 py-1.5',
                'border-[var(--border)] bg-[var(--surface)] text-sm font-medium',
                'text-[var(--text-secondary)] transition-colors',
                'hover:border-[var(--accent)] hover:text-[var(--text-primary)]',
              )}
              aria-label="Download resume PDF"
            >
              <Download className="h-3.5 w-3.5" />
              Resume
            </motion.a>

            {/* Hamburger — mobile */}
            <motion.button
              {...pillHover}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </div>
        </nav>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={closeMobile} />
    </>
  )
}
