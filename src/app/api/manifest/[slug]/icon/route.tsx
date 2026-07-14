import { createClient } from '@/lib/supabase/server'
import { gerarIconeTenant } from '@/lib/gerar-icone-tenant'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tamanho = Number(new URL(request.url).searchParams.get('size')) || 512

  const supabase = await createClient()
  const { data: tenant } = await supabase
    .from('tenants_publicos')
    .select('name, logo_url, cor_principal, cor_secundaria')
    .eq('slug', slug)
    .maybeSingle()

  return gerarIconeTenant(tenant, tamanho)
}
