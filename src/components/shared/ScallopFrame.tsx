'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

// A procedurally-generated scalloped (wavy-edge) circle — the "wax seal /
// stamp" motif from the brand reference's circular vegan badge. Used as a
// decorative frame sitting behind a circular photo or icon.
const SCALLOP_PATH =
  'M98.5 50.0 L96.2 52.7 L91.5 54.8 L88.9 56.9 L90.6 59.6 L94.3 63.3 L95.6 66.6 L92.5 68.3 L87.3 68.7 L84.2 69.8 L84.9 72.9 L87.1 77.6 L87.2 81.2 L83.6 81.7 L78.7 80.4 L75.4 80.3 L74.9 83.5 L75.4 88.6 L74.2 92.0 L70.8 91.3 L66.5 88.3 L63.5 87.1 L62.0 90.0 L60.7 95.0 L58.4 97.8 L55.4 95.9 L52.4 91.7 L50.0 89.5 L47.6 91.7 L44.6 95.9 L41.6 97.8 L39.3 95.0 L38.0 90.0 L36.5 87.1 L33.5 88.3 L29.2 91.3 L25.8 92.0 L24.6 88.6 L25.1 83.5 L24.6 80.3 L21.3 80.4 L16.4 81.7 L12.8 81.2 L12.9 77.6 L15.1 72.9 L15.8 69.8 L12.7 68.7 L7.5 68.3 L4.4 66.6 L5.7 63.3 L9.4 59.6 L11.1 56.9 L8.5 54.8 L3.8 52.7 L1.5 50.0 L3.8 47.3 L8.5 45.2 L11.1 43.1 L9.4 40.4 L5.7 36.7 L4.4 33.4 L7.5 31.7 L12.7 31.3 L15.8 30.2 L15.1 27.1 L12.9 22.4 L12.8 18.8 L16.4 18.3 L21.3 19.6 L24.6 19.7 L25.1 16.5 L24.6 11.4 L25.7 8.0 L29.2 8.7 L33.5 11.7 L36.5 12.9 L38.0 10.0 L39.3 5.0 L41.6 2.2 L44.6 4.1 L47.6 8.3 L50.0 10.5 L52.4 8.3 L55.4 4.1 L58.4 2.2 L60.7 5.0 L62.0 10.0 L63.5 12.9 L66.5 11.7 L70.8 8.7 L74.2 8.0 L75.4 11.4 L74.9 16.5 L75.4 19.7 L78.7 19.6 L83.6 18.3 L87.2 18.8 L87.1 22.4 L84.9 27.1 L84.2 30.2 L87.3 31.3 L92.5 31.7 L95.6 33.4 L94.3 36.7 L90.6 40.4 L88.9 43.1 L91.5 45.2 L96.2 47.3 L98.5 50.0 Z'

interface ScallopFrameProps {
  size?: number
  color?: string
  className?: string
}

export function ScallopFrame({ size = 200, color = 'var(--surface)', className }: ScallopFrameProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('pointer-events-none absolute', className)}
      aria-hidden
      animate={prefersReducedMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    >
      <path d={SCALLOP_PATH} fill={color} />
    </motion.svg>
  )
}
