import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatSuporte } from '@/components/ChatSuporte'
import { PainelClient } from '@/components/painel/PainelClient'

function montarLinkWhatsappSuporte(nomeNegocio: string): string | null {
  const numero = process.env.SUPORTE_WHATSAPP
  if (!numero) return null
  const mensagem = encodeURIComponent(
    `Oi! Sou dona do catálogo "${nomeNegocio}" no Olha Aí e preciso de ajuda.`
  )
  return `https://wa.me/${numero}?text=${mensagem}`
}

export default async function PainelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name, slug, bio, logo_url, cor_principal, cor_secundaria, is_subscribed, trial_started_at')
    .eq('user_id', user.id)
    .single()

  if (!tenant) redirect('/login')

  const trialAcabou =
    !tenant.is_subscribed &&
    new Date(tenant.trial_started_at).getTime() <= Date.now() - 30 * 24 * 60 * 60 * 1000

  const { data: items } = await supabase
    .from('items')
    .select('id, name, price, description, image_url, is_available_today')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-slate-50">
      {trialAcabou && (
        <div className="max-w-md mx-auto mb-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 text-center">
          Seu período grátis acabou. Seu catálogo está fora do ar pros clientes até você assinar.
        </div>
      )}
      <PainelClient tenant={tenant} itemsIniciais={items ?? []} />
      <ChatSuporte linkWhatsappSuporte={montarLinkWhatsappSuporte(tenant.name)} />
    </div>
  )
}
