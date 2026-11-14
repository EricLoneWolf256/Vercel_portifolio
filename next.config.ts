import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Tailwind CSS v4 — scope the rule to app CSS only so it doesn't
  // intercept next/font's internal CSS modules (which breaks font resolution).
  turbopack: {
    rules: {
      './src/**/*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
