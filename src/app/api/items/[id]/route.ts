import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type CorpoAtualizacao = {
  name?: string
  price?: number
  description?: string
  image_url?: string
  is_available_today?: boolean
}

async function tenantDoUsuario(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { erro: NextResponse.json({ error: 'Não autenticado.' }, { status: 401 }) }

  const { data: tenant } = await supabase.from('tenants').select('id').eq('user_id', user.id).single()
  if (!tenant) return { erro: NextResponse.json({ error: 'Catálogo não encontrado.' }, { status: 404 }) }

  return { tenantId: tenant.id }
}

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const resultado = await tenantDoUsuario(supabase)
  if (resultado.erro) return resultado.erro

  let body: CorpoAtualizacao
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  const atualizacao: CorpoAtualizacao = {}

  if (body.name !== undefined) {
    const nome = body.name.trim()
    if (!nome || nome.length > 120) {
      return NextResponse.json({ error: 'Nome do item é obrigatório (até 120 caracteres).' }, { status: 400 })
    }
    atualizacao.name = nome
  }
  if (body.price !== undefined) {
    if (typeof body.price !== 'number' || Number.isNaN(body.price) || body.price < 0) {
      return NextResponse.json({ error: 'Preço inválido.' }, { status: 400 })
    }
    atualizacao.price = body.price
  }
  if (body.description !== undefined) {
    if (body.description.length > 500) {
      return NextResponse.json({ error: 'Descrição muito longa (máx 500 caracteres).' }, { status: 400 })
    }
    atualizacao.description = body.description.trim() || undefined
  }
  if (body.image_url !== undefined) {
    atualizacao.image_url = body.image_url
  }
  if (body.is_available_today !== undefined) {
    if (typeof body.is_available_today !== 'boolean') {
      return NextResponse.json({ error: 'Valor inválido.' }, { status: 400 })
    }
    atualizacao.is_available_today = body.is_available_today
  }

  if (Object.keys(atualizacao).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar.' }, { status: 400 })
  }

  const { data: item, error } = await supabase
    .from('items')
    .update(atualizacao)
    .eq('id', id)
    .eq('tenant_id', resultado.tenantId)
    .select('id, name, price, description, image_url, is_available_today, created_at')
    .single()

  if (error || !item) {
    console.error('[items] Erro ao atualizar:', error?.message)
    return NextResponse.json({ error: 'Erro ao atualizar item.' }, { status: 500 })
  }

  return NextResponse.json({ item })
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const resultado = await tenantDoUsuario(supabase)
  if (resultado.erro) return resultado.erro

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .eq('tenant_id', resultado.tenantId)

  if (error) {
    console.error('[items] Erro ao excluir:', error.message)
    return NextResponse.json({ error: 'Erro ao excluir item.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
