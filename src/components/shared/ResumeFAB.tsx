'use client'

import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { siteConfig } from '@/config/siteConfig'
import { cn } from '@/lib/utils'
import { scaleHover } from '@/lib/motion'

export function ResumeFAB({ className }: { className?: string }) {
  return (
    <motion.a
      {...scaleHover}
      href={siteConfig.resumeUrl}
      download={siteConfig.resumeFilename}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download resume"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'flex items-center gap-2 rounded-full',
        'bg-[var(--accent)] text-white shadow-lg',
        'px-4 py-3 text-sm font-semibold',
        'transition-colors duration-200 hover:bg-[var(--accent-hover)] hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
        'md:hidden', // Only show on mobile — desktop has it in the nav
        className,
      )}
    >
      <Download className="h-4 w-4" />
      <span>Resume</span>
    </motion.a>
  )
}
