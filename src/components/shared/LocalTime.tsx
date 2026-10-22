'use client'

import { useEffect, useState } from 'react'
import { siteConfig } from '@/config/siteConfig'

interface LocalTimeProps {
  /** Show full date+time or time only */
  mode?: 'time' | 'full'
  className?: string
}

export function LocalTime({ mode = 'time', className }: LocalTimeProps) {
  const [timeStr, setTimeStr] = useState<string>('')

  useEffect(() => {
    const tick = () => {
      const opts: Intl.DateTimeFormatOptions =
        mode === 'full'
          ? {
              timeZone: siteConfig.timezone,
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }
          : {
              timeZone: siteConfig.timezone,
              hour: '2-digit',
              minute: '2-digit',
            }

      setTimeStr(new Date().toLocaleTimeString('en-US', opts))
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [mode])

  if (!timeStr) return null

  return (
    <span className={className}>
      {timeStr}{' '}
      <span className="text-[var(--text-tertiary)] text-xs">{siteConfig.timezoneLabel}</span>
    </span>
  )
}
