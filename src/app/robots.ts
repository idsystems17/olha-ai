import type { MetadataRoute } from 'next'

// Sem Disallow pra nenhum robô — inclui os crawlers de IA (GPTBot,
// ClaudeBot, PerplexityBot, Google-Extended etc.) de propósito: a landing
// page é feita pra ser encontrada e citada por assistentes, não só pelo
// Google. Só as áreas logadas (painel, api) ficam de fora do índice.
export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/painel', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
