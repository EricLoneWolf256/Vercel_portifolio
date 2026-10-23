import { getSiteSettings } from '@/lib/data/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">Site Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-tertiary)]">
          Everything on the homepage outside of Projects/Experience/Skills/Testimonials lives here.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
