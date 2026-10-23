import { Sidebar } from './Sidebar'

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode
  email: string | null
}) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar email={email} />
      <main className="min-w-0 flex-1 overflow-x-hidden p-6 md:p-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  )
}
