/**
 * Cloudinary Upload Script
 * ------------------------
 * Usage:
 *   npx tsx scripts/upload-cloudinary.ts <local-file-path> <cloudinary-folder/filename>
 *
 * Examples:
 *   npx tsx scripts/upload-cloudinary.ts ./public/images/avatar.jpg portfolio/avatar
 *   npx tsx scripts/upload-cloudinary.ts ./public/images/project1.png portfolio/projects/my-app
 *   npx tsx scripts/upload-cloudinary.ts ./public/resume.pdf portfolio/resume
 *
 * The second argument becomes the `public_id` in Cloudinary — the path you use
 * in getCloudinaryUrl() and getCloudinaryRawUrl() throughout the codebase.
 */

import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

async function upload(localPath: string, publicId: string) {
  const absolutePath = path.resolve(process.cwd(), localPath)

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌  File not found: ${absolutePath}`)
    process.exit(1)
  }

  const ext = path.extname(localPath).toLowerCase()
  const isRaw = ext === '.pdf' || ext === '.doc' || ext === '.docx' || ext === '.zip'

  console.log(`\n📤  Uploading: ${absolutePath}`)
  console.log(`    → Public ID: ${publicId}`)
  console.log(`    → Type: ${isRaw ? 'raw (PDF/document)' : 'image'}`)
  console.log()

  try {
    const result = await cloudinary.uploader.upload(absolutePath, {
      public_id:      publicId,
      resource_type:  isRaw ? 'raw' : 'image',
      overwrite:      true,
      // Use the upload preset for unsigned flow consistency
      // (preset is optional here since we're using API key/secret)
      use_filename:   false,
      unique_filename: false,
    })

    console.log('✅  Upload successful!')
    console.log()
    console.log('   Public ID  :', result.public_id)
    console.log('   Format     :', result.format)
    console.log('   Size       :', result.bytes ? `${(result.bytes / 1024).toFixed(1)} KB` : 'n/a')
    console.log('   Secure URL :', result.secure_url)
    console.log()

    if (isRaw) {
      console.log('📎  Use this in siteConfig.ts → resumeUrl:')
      console.log(`    '${result.secure_url}'`)
    } else {
      console.log('🖼️   Use this public_id in your data:')
      console.log(`    '${result.public_id}'`)
    }
    console.log()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌  Upload failed:', msg)
    process.exit(1)
  }
}

// ─── CLI entrypoint ────────────────────────────────────────────────────────────
const [,, localPath, publicId] = process.argv

if (!localPath || !publicId) {
  console.log(`
Usage:
  npx tsx scripts/upload-cloudinary.ts <local-file> <cloudinary-public-id>

Examples:
  npx tsx scripts/upload-cloudinary.ts ./public/images/avatar.jpg    portfolio/avatar
  npx tsx scripts/upload-cloudinary.ts ./public/images/project.png   portfolio/projects/my-project
  npx tsx scripts/upload-cloudinary.ts ./public/resume.pdf           portfolio/resume
  npx tsx scripts/upload-cloudinary.ts ./public/images/logo.png      portfolio/logos/company-name
`)
  process.exit(0)
}

upload(localPath, publicId)
