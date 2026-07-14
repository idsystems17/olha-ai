import { createClient } from '@/lib/supabase/server'
import { gerarIconeTenant } from '@/lib/gerar-icone-tenant'

export const dynamic = 'force-dynamic'
export const size = { width: 180, height: 180 }

export default async function AppleIcon({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tenant } = await supabase
    .from('tenants_publicos')
    .select('name, logo_url, cor_principal, cor_secundaria')
    .eq('slug', slug)
    .maybeSingle()

  return gerarIconeTenant(tenant, 180)
}
