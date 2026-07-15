import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatSuporte } from '@/components/ChatSuporte'
import { PainelClient } from '@/components/painel/PainelClient'
import { PopupAssinaturaAtiva } from '@/components/painel/PopupAssinaturaAtiva'
import { linkCheckoutKiwify } from '@/lib/kiwify'

function montarLinkWhatsappSuporte(nomeNegocio: string): string | null {
  const numero = process.env.SUPORTE_WHATSAPP
  if (!numero) return null
  const mensagem = encodeURIComponent(
    `Oi! Sou dona do catálogo "${nomeNegocio}" no Olha Aí e preciso de ajuda.`
  )
  return `https://wa.me/${numero}?text=${mensagem}`
}

export async function generateMetadata() {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  return { manifest: `${base}/api/manifest/painel` }
}

export default async function PainelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name, slug, bio, logo_url, cor_principal, cor_secundaria, is_subscribed, is_open, trial_started_at')
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
          <p>Seu período grátis acabou. Seu catálogo está fora do ar pros clientes até você assinar.</p>
          <p className="mt-1 text-xs">
            Se não assinar logo, seus dados (fotos e cardápio) serão apagados. Se quiser voltar depois,
            vai precisar montar o catálogo de novo.
          </p>
          <a
            href={linkCheckoutKiwify(tenant.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold"
          >
            Assinar agora — R$ 19,90/mês
          </a>
        </div>
      )}
      <PainelClient tenant={tenant} itemsIniciais={items ?? []} />
      <ChatSuporte linkWhatsappSuporte={montarLinkWhatsappSuporte(tenant.name)} />
      <Suspense fallback={null}>
        <PopupAssinaturaAtiva />
      </Suspense>
    </div>
  )
}
