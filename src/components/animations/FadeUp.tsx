'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  /** How much of the element must be visible before animating (0–1) */
  threshold?: number
  /** Only animate once */
  once?: boolean
}

export function FadeUp({
  children,
  delay = 0,
  duration = 0.5,
  className,
  threshold = 0.15,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const prefersReducedMotion = useReducedMotion()

  const variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
