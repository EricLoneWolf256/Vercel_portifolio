import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/siteConfig'

export const alt = `${siteConfig.name} — ${siteConfig.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#CE6D3C',
          backgroundImage: 'linear-gradient(180deg, #CC6B3A 0%, #CE6D3C 50%, #D87B48 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)',
          }}
        />

        {/* Availability badge */}
        {siteConfig.availability.status === 'open' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#E8ECC4',
              border: '1px solid rgba(103,116,36,0.3)',
              borderRadius: '999px',
              padding: '6px 14px',
              width: 'fit-content',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#677424',
              }}
            />
            <span style={{ color: '#677424', fontSize: '14px', fontWeight: 600 }}>
              {siteConfig.availability.label}
            </span>
          </div>
        )}

        {/* Name */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#140D07',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}
        >
          {siteConfig.name}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: '#140D07',
            marginBottom: '16px',
          }}
        >
          {siteConfig.title}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '20px',
            color: '#241A10',
            maxWidth: '700px',
            lineHeight: 1.5,
          }}
        >
          {siteConfig.tagline}
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            right: '80px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#241A10', fontSize: '16px', fontFamily: 'monospace' }}>
            {siteConfig.url.replace('https://', '')}
          </span>
          <span style={{ color: '#5C4836', fontSize: '16px' }}>
            {siteConfig.location}
          </span>
        </div>
      </div>
    ),
    size,
  )
}
