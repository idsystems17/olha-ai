import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  const supabase = await createClient()
  const { data: tenant } = await supabase
    .from('tenants_publicos')
    .select('name, cor_principal')
    .eq('slug', slug)
    .maybeSingle()

  const nome = tenant?.name ?? 'Olha Aí'
  const iconUrl = `${base}/api/manifest/${slug}/icon`

  // Sempre tamanhos numéricos explícitos batendo com o arquivo real gerado —
  // o Windows ignora ícones declarados como sizes:"any" e cai no genérico.
  const icons = [
    { src: `${iconUrl}?size=192`, sizes: '192x192', type: 'image/png', purpose: 'any' as const },
    { src: `${iconUrl}?size=512`, sizes: '512x512', type: 'image/png', purpose: 'any' as const },
    { src: `${iconUrl}?size=512`, sizes: '512x512', type: 'image/png', purpose: 'maskable' as const },
  ]

  const manifest = {
    name: nome,
    short_name: nome.slice(0, 20),
    description: `Catálogo de ${nome} no Olha Aí`,
    start_url: `/${slug}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: tenant?.cor_principal ?? '#1e293b',
    icons,
  }

  return Response.json(manifest, { headers: { 'Content-Type': 'application/manifest+json' } })
}
