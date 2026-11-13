'use client'

import { motion } from 'framer-motion'
import { scaleHover } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.764.464 3.49 1.343 5.004L2 22l5.126-1.345A9.952 9.952 0 0012.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.165a8.14 8.14 0 01-4.148-1.135l-.297-.177-3.044.799.812-2.967-.194-.304a8.172 8.172 0 01-1.252-4.381c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.676 8.165-8.2 8.165z" />
    </svg>
  )
}

export function WhatsAppFAB({ settings, className }: { settings: SiteSettings; className?: string }) {
  if (!settings.whatsapp) return null

  const digits = settings.whatsapp.replace(/\D/g, '')
  if (!digits) return null

  return (
    <motion.a
      {...scaleHover}
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message on WhatsApp"
      className={cn(
        'fixed bottom-6 left-6 z-50',
        'flex h-12 w-12 items-center justify-center rounded-full',
        'bg-[#25D366] text-white shadow-lg',
        'transition-shadow duration-200 hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
        className,
      )}
    >
      <WhatsAppIcon className="h-6 w-6" />
    </motion.a>
  )
}
