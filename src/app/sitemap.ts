import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/siteConfig'
import { getProjects } from '@/lib/data/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}
