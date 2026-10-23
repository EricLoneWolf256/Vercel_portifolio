'use server'

import { v2 as cloudinary } from 'cloudinary'
import { requireAdminSession } from '@/lib/auth/session'

export type UploadResult =
  | { success: true; publicId: string }
  | { success: false; error: string }

export type RawUploadResult =
  | { success: true; url: string }
  | { success: false; error: string }

const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const MAX_RESUME_BYTES = 10 * 1024 * 1024 // 10MB

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

// Shared by every admin form with an image field (projects, experience logos,
// testimonial avatars, the site avatar). Signed upload via the same
// Cloudinary credentials `scripts/upload-cloudinary.ts` already uses —
// no unsigned upload preset needed.
export async function uploadImage(formData: FormData, folder: string): Promise<UploadResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const file = formData.get('file')
  if (!(file instanceof File)) return { success: false, error: 'No file provided' }
  if (!file.type.startsWith('image/')) return { success: false, error: 'File must be an image' }
  if (file.size > MAX_BYTES) return { success: false, error: 'Image must be under 10MB' }

  configureCloudinary()

  try {
    const arrayBuffer = await file.arrayBuffer()
    const dataUri = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
      overwrite: true,
    })

    return { success: true, publicId: result.public_id }
  } catch (error) {
    console.error('[uploadImage]', error)
    return { success: false, error: 'Upload failed. Please try again.' }
  }
}

// Resume upload — stored as a Cloudinary "raw" asset (not an image), same as
// `scripts/upload-cloudinary.ts` does for the initial manual upload. Returns
// the full secure URL since that's how `SiteSettings.resumeUrl` is stored
// (matching the pre-existing siteConfig.resumeUrl shape).
export async function uploadResume(formData: FormData): Promise<RawUploadResult> {
  const session = await requireAdminSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const file = formData.get('file')
  if (!(file instanceof File)) return { success: false, error: 'No file provided' }
  if (file.type !== 'application/pdf') return { success: false, error: 'Resume must be a PDF' }
  if (file.size > MAX_RESUME_BYTES) return { success: false, error: 'File must be under 10MB' }

  configureCloudinary()

  try {
    const arrayBuffer = await file.arrayBuffer()
    const dataUri = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio',
      public_id: 'resume',
      resource_type: 'raw',
      overwrite: true,
    })

    return { success: true, url: result.secure_url }
  } catch (error) {
    console.error('[uploadResume]', error)
    return { success: false, error: 'Upload failed. Please try again.' }
  }
}
