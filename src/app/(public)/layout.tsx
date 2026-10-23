import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ResumeFAB } from '@/components/shared/ResumeFAB'
import { getSiteSettings } from '@/lib/data/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <>
      <Navbar settings={settings} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
      <ResumeFAB settings={settings} />
    </>
  )
}
