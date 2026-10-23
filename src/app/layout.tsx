import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { siteConfig } from '@/config/siteConfig'
import { getSiteSettings } from '@/lib/data/settings'
import '@/app/globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-cal-sans', // reuse the same CSS var so all font-display references work
  display: 'swap',
  weight: ['600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Reads from Firestore (via getSiteSettings) with siteConfig.ts as the
// fallback, so this stays in sync with whatever the owner sets in
// /admin/settings without a redeploy.

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const titleFull = `${settings.name} — ${settings.title}`

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: titleFull,
      template: `%s | ${settings.name}`,
    },
    description: settings.description,
    keywords: [
      settings.title,
      settings.name,
      'portfolio',
      'Next.js',
      'React',
      'TypeScript',
      'Firebase',
      'Full-Stack Engineer',
    ],
    authors: [{ name: settings.name, url: siteConfig.url }],
    creator: settings.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      siteName: settings.name,
      title: titleFull,
      description: settings.description,
      images: [
        {
          url: settings.ogImage,
          width: 1200,
          height: 630,
          alt: titleFull,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleFull,
      description: settings.description,
      creator: settings.twitterHandle,
      images: [settings.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.name,
    jobTitle: settings.title,
    description: settings.description,
    url: siteConfig.url,
    sameAs: [settings.social.github, settings.social.linkedin, settings.social.twitter ?? ''].filter(Boolean),
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Firebase', 'Node.js'],
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased">
        {/* Skip to main content — a11y */}
        <a href="#main" className="skip-to-main">
          Skip to main content
        </a>

        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
