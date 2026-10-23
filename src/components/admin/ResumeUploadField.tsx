'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { uploadResume } from '@/lib/admin/upload-action'
import { cn } from '@/lib/utils'

interface ResumeUploadFieldProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ResumeUploadField({ value, onChange, className }: ResumeUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.set('file', file)
    const result = await uploadResume(formData)

    if (result.success) {
      onChange(result.url)
    } else {
      setError(result.error)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Resume (PDF)</label>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-tertiary)]">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className={cn(
              'block w-full text-sm text-[var(--text-secondary)]',
              'file:mr-3 file:rounded-lg file:border file:border-[var(--border)] file:bg-[var(--surface)]',
              'file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[var(--text-secondary)]',
              'file:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
            )}
          />
          {uploading && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading...
            </p>
          )}
          {error && <p className="mt-1 text-xs text-[var(--error)]">{error}</p>}
          {value && !error && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-xs text-[var(--accent)] hover:underline"
            >
              {value}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
