'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ResumeFAB } from '@/components/shared/ResumeFAB'
import { WhatsAppFAB } from '@/components/shared/WhatsAppFAB'
import type { SiteSettings } from '@/types'

// Coordinates the floating action buttons with the mobile nav panel — the
// panel has its own "Download Resume" button in the same bottom-right
// corner the Resume FAB occupies, so the FABs need to hide while it's open.
export function PublicChrome({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <>
      <Navbar settings={settings} onMobileOpenChange={setMobileNavOpen} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <AnimatePresence>
        {!mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ResumeFAB settings={settings} />
            <WhatsAppFAB settings={settings} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
