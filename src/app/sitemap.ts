import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const agora = new Date()

  return [
    { url: `${base}/`, lastModified: agora, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/como-funciona`, lastModified: agora, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/cadastro`, lastModified: agora, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/termos-de-uso`, lastModified: agora, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/politica-de-privacidade`, lastModified: agora, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
