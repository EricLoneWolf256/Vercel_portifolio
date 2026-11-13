import { PublicChrome } from '@/components/layout/PublicChrome'
import { getSiteSettings } from '@/lib/data/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return <PublicChrome settings={settings}>{children}</PublicChrome>
}
