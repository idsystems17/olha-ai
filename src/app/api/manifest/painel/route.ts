import { buscarTenantAutenticado } from '@/lib/tenant-autenticado'
import { versaoAparencia } from '@/lib/versao-aparencia'

export const dynamic = 'force-dynamic'

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const tenant = await buscarTenantAutenticado()

  const nome = tenant ? `${tenant.name} — Olha Aí` : 'Olha Aí'
  const versao = versaoAparencia([tenant?.name, tenant?.logo_url, tenant?.cor_principal, tenant?.cor_secundaria])
  const iconUrl = `${base}/api/manifest/painel/icon`

  // Sempre tamanhos numéricos explícitos batendo com o arquivo real gerado —
  // o Windows ignora ícones declarados como sizes:"any" e cai no genérico.
  const icons = [
    { src: `${iconUrl}?size=192&v=${versao}`, sizes: '192x192', type: 'image/png', purpose: 'any' as const },
    { src: `${iconUrl}?size=512&v=${versao}`, sizes: '512x512', type: 'image/png', purpose: 'any' as const },
    { src: `${iconUrl}?size=512&v=${versao}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' as const },
  ]

  const manifest = {
    name: nome,
    short_name: nome.slice(0, 20),
    description: 'Painel pra gerenciar seu catálogo no Olha Aí',
    start_url: '/painel',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: tenant?.cor_principal ?? '#1e293b',
    icons,
  }

  return Response.json(manifest, { headers: { 'Content-Type': 'application/manifest+json' } })
}
