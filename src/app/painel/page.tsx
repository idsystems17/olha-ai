import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SuporteFaq } from '@/components/SuporteFaq'
import { PainelClient } from '@/components/painel/PainelClient'
import { PopupAssinaturaAtiva } from '@/components/painel/PopupAssinaturaAtiva'
import { linkCheckoutKiwify } from '@/lib/kiwify'

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

  const diasDesdeInicio = Math.max(
    0,
    Math.floor((Date.now() - new Date(tenant.trial_started_at).getTime()) / (24 * 60 * 60 * 1000))
  )
  const diasRestantes = Math.max(0, 30 - diasDesdeInicio)
  const trialAcabou = !tenant.is_subscribed && diasDesdeInicio >= 30

  const { data: items } = await supabase
    .from('items')
    .select('id, name, price, description, image_url, is_available_today')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <PainelClient
        tenant={tenant}
        itemsIniciais={items ?? []}
        diasRestantes={diasRestantes}
        trialAcabou={trialAcabou}
        linkCheckout={linkCheckoutKiwify(tenant.id)}
      />
      <SuporteFaq emailSuporte={process.env.NEXT_PUBLIC_SUPORTE_EMAIL ?? null} nomeNegocio={tenant.name} />
      <Suspense fallback={null}>
        <PopupAssinaturaAtiva />
      </Suspense>
    </>
  )
}
