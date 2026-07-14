import { createClient } from '@/lib/supabase/server'

export async function buscarTenantAutenticado() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, logo_url, cor_principal, cor_secundaria')
    .eq('user_id', user.id)
    .maybeSingle()

  return tenant
}
