import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Roda diariamente (ver vercel.json). Apaga tenants com trial vencido há mais
// de 30 dias que nunca assinaram — fotos do Storage, linha de tenants (itens
// somem junto via ON DELETE CASCADE) e o próprio login (auth.users), senão
// ela ficaria logada mas sem tenant, presa num loop de redirecionamento.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const admin = createAdminClient()
  const corteData = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: expirados, error: erroConsulta } = await admin
    .from('tenants')
    .select('id, user_id, slug')
    .eq('is_subscribed', false)
    .lte('trial_started_at', corteData)

  if (erroConsulta) {
    console.error('[cron-expirar-trials] Erro ao consultar tenants expirados:', erroConsulta.message)
    return NextResponse.json({ error: 'query failed' }, { status: 500 })
  }

  console.log(`[cron-expirar-trials] ${expirados.length} tenant(s) com trial expirado encontrado(s).`)

  let sucesso = 0
  let falha = 0

  for (const tenant of expirados) {
    try {
      const { data: arquivos } = await admin.storage.from('fotos').list(tenant.id)
      if (arquivos && arquivos.length > 0) {
        const caminhos = arquivos.map((arquivo) => `${tenant.id}/${arquivo.name}`)
        const { error: erroStorage } = await admin.storage.from('fotos').remove(caminhos)
        if (erroStorage) throw new Error(`Erro ao apagar fotos: ${erroStorage.message}`)
        console.log(`[cron-expirar-trials] ${caminhos.length} foto(s) removida(s) — tenant ${tenant.id} (${tenant.slug})`)
      }

      const { error: erroTenant } = await admin.from('tenants').delete().eq('id', tenant.id)
      if (erroTenant) throw new Error(`Erro ao apagar tenant: ${erroTenant.message}`)

      const { error: erroUser } = await admin.auth.admin.deleteUser(tenant.user_id)
      if (erroUser) throw new Error(`Erro ao apagar usuário: ${erroUser.message}`)

      console.log(`[cron-expirar-trials] Apagado com sucesso — tenant ${tenant.id} (${tenant.slug})`)
      sucesso++
    } catch (erro) {
      console.error(
        `[cron-expirar-trials] FALHA ao apagar tenant ${tenant.id} (${tenant.slug}):`,
        erro instanceof Error ? erro.message : erro
      )
      falha++
    }
  }

  console.log(`[cron-expirar-trials] Concluído — ${sucesso} apagado(s), ${falha} falha(s), ${expirados.length} no total.`)
  return NextResponse.json({ ok: true, total: expirados.length, sucesso, falha })
}
