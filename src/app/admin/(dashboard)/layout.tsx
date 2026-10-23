import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth/session'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  return <AdminShell email={session.email}>{children}</AdminShell>
}
