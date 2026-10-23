import type { MotionProps } from 'framer-motion'

// Shared Framer Motion hover/tap presets — spread onto `motion.*` elements.
// Each one includes a subtle animated corner-radius morph alongside scale,
// so buttons, pills, and cards round out a touch further on hover.

export const ctaHover: MotionProps = {
  whileHover: { scale: 1.03, borderRadius: 18 },
  whileTap: { scale: 0.96, borderRadius: 8 },
  transition: { type: 'spring', stiffness: 400, damping: 22 },
}

export const pillHover: MotionProps = {
  whileHover: { scale: 1.04, borderRadius: 14 },
  whileTap: { scale: 0.95, borderRadius: 8 },
  transition: { type: 'spring', stiffness: 450, damping: 24 },
}

export const cardHover: MotionProps = {
  whileHover: { y: -4, borderRadius: 28 },
  whileTap: { scale: 0.985 },
  transition: { type: 'spring', stiffness: 350, damping: 28 },
}

export const iconHover: MotionProps = {
  whileHover: { scale: 1.15, rotate: -4 },
  whileTap: { scale: 0.9 },
  transition: { type: 'spring', stiffness: 500, damping: 20 },
}

// For already fully-rounded (pill/circle) elements, where morphing the
// radius would un-round them rather than enhance the shape.
export const scaleHover: MotionProps = {
  whileHover: { scale: 1.06 },
  whileTap: { scale: 0.94 },
  transition: { type: 'spring', stiffness: 400, damping: 22 },
}
