import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SkillForm } from '@/components/admin/SkillForm'

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/skills"
        className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to skills
      </Link>
      <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">New skill</h1>
      <SkillForm />
    </div>
  )
}
