import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { normalizarCpf, hashCpf } from '@/lib/cpf'

// Eventos que ativam a assinatura (primeira compra ou renovação mensal).
const EVENTOS_ATIVAM = new Set(['order_approved', 'subscription_renewed'])
// Eventos que desativam. "subscription_late" (atraso) não entra aqui de
// propósito — dá um tempo de tolerância em vez de cortar no primeiro atraso.
const EVENTOS_DESATIVAM = new Set(['subscription_canceled', 'order_refunded', 'chargeback'])

function assinaturaValida(corpoBruto: string, assinaturaRecebida: string): boolean {
  const segredo = process.env.KIWIFY_WEBHOOK_SECRET
  if (!segredo || !assinaturaRecebida) return false

  const esperada = createHmac('sha1', segredo).update(corpoBruto).digest('hex')
  const bufEsperada = Buffer.from(esperada, 'utf8')
  const bufRecebida = Buffer.from(assinaturaRecebida, 'utf8')

  if (bufEsperada.length !== bufRecebida.length) return false
  return timingSafeEqual(bufEsperada, bufRecebida)
}

type PayloadKiwify = {
  order_id?: string
  webhook_event_type?: string
  TrackingParameters?: { s1?: string | null }
  Customer?: { CPF?: string | null }
}

export async function POST(request: NextRequest) {
  const assinaturaRecebida = request.nextUrl.searchParams.get('signature') ?? ''
  const corpoBruto = await request.text()

  if (!assinaturaValida(corpoBruto, assinaturaRecebida)) {
    console.warn('[kiwify-webhook] Assinatura inválida — requisição recusada.')
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let payload: PayloadKiwify
  try {
    payload = JSON.parse(corpoBruto)
  } catch {
    console.error('[kiwify-webhook] Corpo não é JSON válido, mesmo com assinatura ok.')
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const { order_id: orderId, webhook_event_type: evento } = payload
  console.log('[kiwify-webhook] Evento recebido:', evento, '| order_id:', orderId)

  if (!orderId || !evento) {
    console.error('[kiwify-webhook] Payload sem order_id ou webhook_event_type.')
    return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Idempotência: se esse order_id já foi processado, não faz nada de novo
  // (a Kiwify pode reenviar o mesmo evento mais de uma vez).
  const { data: jaProcessado } = await admin
    .from('kiwify_eventos_processados')
    .select('order_id')
    .eq('order_id', orderId)
    .maybeSingle()

  if (jaProcessado) {
    console.log('[kiwify-webhook] order_id já processado antes, ignorando:', orderId)
    return NextResponse.json({ ok: true, ja_processado: true })
  }

  if (!EVENTOS_ATIVAM.has(evento) && !EVENTOS_DESATIVAM.has(evento)) {
    console.log('[kiwify-webhook] Evento não afeta assinatura, só registrando:', evento)
    await admin.from('kiwify_eventos_processados').insert({ order_id: orderId, webhook_event_type: evento })
    return NextResponse.json({ ok: true })
  }

  const novoStatus = EVENTOS_ATIVAM.has(evento)

  // Achar o tenant: primeiro pelo s1 (tenant_id passado no link de checkout,
  // ver src/lib/kiwify.ts), com fallback pelo CPF caso o s1 não venha.
  const tenantIdViaTracking = payload.TrackingParameters?.s1 || null
  let tenantId: string | null = null

  if (tenantIdViaTracking) {
    const { data: tenantPorId } = await admin
      .from('tenants')
      .select('id')
      .eq('id', tenantIdViaTracking)
      .maybeSingle()
    tenantId = tenantPorId?.id ?? null
    if (!tenantId) {
      console.warn('[kiwify-webhook] s1 veio preenchido mas não bate com nenhum tenant:', tenantIdViaTracking)
    }
  }

  if (!tenantId && payload.Customer?.CPF) {
    const cpfHash = hashCpf(normalizarCpf(payload.Customer.CPF))
    const { data: tenantPorCpf } = await admin
      .from('tenants')
      .select('id')
      .eq('cpf_hash', cpfHash)
      .maybeSingle()
    tenantId = tenantPorCpf?.id ?? null
    if (tenantId) {
      console.log('[kiwify-webhook] Tenant achado pelo CPF (fallback, sem s1):', tenantId)
    }
  }

  if (!tenantId) {
    console.error(
      '[kiwify-webhook] NÃO FOI POSSÍVEL ACHAR O TENANT pra esse pagamento — nem s1 nem CPF bateram. ' +
        'order_id:', orderId, '| evento:', evento
    )
    // 200 mesmo assim: reenviar não vai resolver, o problema é de vínculo,
    // não passageiro. Fica registrado no log pra investigação manual.
    await admin.from('kiwify_eventos_processados').insert({ order_id: orderId, webhook_event_type: evento })
    return NextResponse.json({ ok: true, tenant_nao_encontrado: true })
  }

  const { error: erroUpdate } = await admin
    .from('tenants')
    .update({ is_subscribed: novoStatus })
    .eq('id', tenantId)

  if (erroUpdate) {
    console.error('[kiwify-webhook] Erro ao atualizar is_subscribed:', erroUpdate.message)
    return NextResponse.json({ error: 'update failed' }, { status: 500 })
  }

  console.log(
    '[kiwify-webhook] Assinatura atualizada — tenant:', tenantId,
    '| evento:', evento, '| is_subscribed agora:', novoStatus
  )

  await admin.from('kiwify_eventos_processados').insert({ order_id: orderId, webhook_event_type: evento, tenant_id: tenantId })

  return NextResponse.json({ ok: true })
}
