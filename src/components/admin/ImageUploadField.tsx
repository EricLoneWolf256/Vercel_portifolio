'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2 } from 'lucide-react'
import { getCloudinaryUrl } from '@/lib/cloudinary'
import { uploadImage } from '@/lib/admin/upload-action'
import { cn } from '@/lib/utils'

interface ImageUploadFieldProps {
  label: string
  /** Cloudinary folder new uploads go into, e.g. "portfolio/projects" */
  folder: string
  /** Current Cloudinary public_id stored on the document */
  value: string
  onChange: (publicId: string) => void
  className?: string
}

export function ImageUploadField({ label, folder, value, onChange, className }: ImageUploadFieldProps) {
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
    const result = await uploadImage(formData, folder)

    if (result.success) {
      onChange(result.publicId)
    } else {
      setError(result.error)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const previewUrl = value ? getCloudinaryUrl(value, { width: 128, height: 128, crop: 'fill' }) : null

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">{label}</label>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]">
          {previewUrl ? (
            <Image src={previewUrl} alt="" width={64} height={64} className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-5 w-5 text-[var(--text-tertiary)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
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
          {value && !error && <p className="mt-1 truncate text-xs text-[var(--text-tertiary)]">{value}</p>}
        </div>
      </div>
    </div>
  )
}
