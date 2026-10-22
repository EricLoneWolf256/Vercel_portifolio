const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'demo'

export type ImageTransform = {
  width?: number
  height?: number
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop'
  gravity?: 'auto' | 'face' | 'center'
  radius?: number | 'max'
}

/**
 * Build a Cloudinary image URL with automatic format/quality optimisation.
 *
 * @example
 * getCloudinaryUrl('portfolio/projects/my-app', { width: 800 })
 * // → https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/portfolio/projects/my-app
 */
export function getCloudinaryUrl(publicId: string, options: ImageTransform = {}): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop,
    gravity,
    radius,
  } = options

  const transforms: string[] = [`f_${format}`, `q_${quality}`]

  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (crop) transforms.push(`c_${crop}`)
  if (gravity) transforms.push(`g_${gravity}`)
  if (radius !== undefined) transforms.push(`r_${radius}`)

  const transformStr = transforms.join(',')

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/${publicId}`
}

/**
 * Build a Cloudinary raw (non-image) file URL.
 * Used for the resume PDF.
 */
export function getCloudinaryRawUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${publicId}`
}

/**
 * Build a responsive sizes attribute string for use with next/image.
 */
export function cloudinarySizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([bp, size]) => (bp === 'default' ? size : `(max-width: ${bp}) ${size}`))
    .join(', ')
}
