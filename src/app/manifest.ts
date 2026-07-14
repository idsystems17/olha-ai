import type { MetadataRoute } from 'next'

// Manifest genérico — usado pelas páginas sem negócio específico (landing,
// login, cadastro). O catálogo público e o painel de cada vendedora têm o
// próprio manifest dinâmico (ver src/app/api/manifest).
export default function manifest(): MetadataRoute.Manifest {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  return {
    name: 'Olha Aí',
    short_name: 'Olha Aí',
    description: 'Catálogo digital simples pra quem vende pelo WhatsApp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f97316',
    icons: [
      { src: `${base}/api/icone-generico?size=192`, sizes: '192x192', type: 'image/png' },
      { src: `${base}/api/icone-generico?size=512`, sizes: '512x512', type: 'image/png' },
      { src: `${base}/api/icone-generico?size=512`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
