import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { normalizarWhatsapp, whatsappValido } from '@/lib/whatsapp'

type CorpoConta = {
  whatsapp?: string
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  let body: CorpoConta
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  if (body.whatsapp === undefined) {
    return NextResponse.json({ error: 'Nada para atualizar.' }, { status: 400 })
  }

  const whatsapp = normalizarWhatsapp(body.whatsapp)
  if (!whatsappValido(whatsapp)) {
    return NextResponse.json({ error: 'WhatsApp inválido. Use DDD + número.' }, { status: 400 })
  }

  const { data: tenant, error } = await supabase
    .from('tenants')
    .update({ whatsapp })
    .eq('user_id', user.id)
    .select('whatsapp')
    .single()

  if (error || !tenant) {
    console.error('[conta] Erro ao atualizar:', error?.message)
    return NextResponse.json({ error: 'Erro ao salvar alterações.' }, { status: 500 })
  }

  return NextResponse.json({ tenant })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  let body: { senha?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  if (!body.senha) {
    return NextResponse.json({ error: 'Confirme sua senha pra excluir a conta.' }, { status: 400 })
  }

  // Não deixa excluir com assinatura ativa — a Kiwify não expõe cancelamento
  // via API, então a cobrança continuaria rodando sem a gente conseguir
  // parar. A pessoa precisa cancelar lá primeiro (ver AbaConta.tsx).
  const { data: tenantAtual } = await supabase
    .from('tenants')
    .select('is_subscribed')
    .eq('user_id', user.id)
    .single()

  if (tenantAtual?.is_subscribed) {
    return NextResponse.json(
      { error: 'Cancele sua assinatura na Kiwify antes de excluir a conta.' },
      { status: 409 }
    )
  }

  // Reconfirma a senha antes de excluir — ação irreversível, mesmo padrão
  // de segurança usado na troca de senha (não confia só na checagem do
  // cliente, já que essa rota pode ser chamada direto).
  const clienteVerificacao = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { error: erroSenha } = await clienteVerificacao.auth.signInWithPassword({
    email: user.email,
    password: body.senha,
  })
  if (erroSenha) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
  }

  // Apaga o usuário — a exclusão cascateia (on delete cascade) pro tenant
  // e pros itens do catálogo automaticamente (ver supabase/migrations/0001_init.sql).
  const admin = createAdminClient()
  const { error: erroExclusao } = await admin.auth.admin.deleteUser(user.id)
  if (erroExclusao) {
    console.error('[conta] Erro ao excluir conta:', erroExclusao.message)
    return NextResponse.json({ error: 'Erro ao excluir conta. Tente de novo.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
