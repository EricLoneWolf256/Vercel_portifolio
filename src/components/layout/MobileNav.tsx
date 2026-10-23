'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '@/config/siteConfig'
import { ctaHover, pillHover } from '@/lib/motion'

const MotionLink = motion.create(Link)

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.nav
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--surface)] border-l border-[var(--border)] p-6"
            aria-label="Mobile navigation"
          >
            {/* Close */}
            <motion.button
              {...pillHover}
              onClick={onClose}
              className="mb-8 self-end rounded-lg p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Links */}
            <ul className="flex flex-col gap-1">
              {siteConfig.nav.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                >
                  <MotionLink
                    {...pillHover}
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-lg px-4 py-3 text-lg font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </MotionLink>
                </motion.li>
              ))}
            </ul>

            {/* Resume CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto"
            >
              <motion.a
                {...ctaHover}
                href={siteConfig.resumeUrl}
                download={siteConfig.resumeFilename}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </motion.a>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
