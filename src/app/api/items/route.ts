import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type CorpoItem = {
  name?: string
  price?: number
  description?: string
  image_url?: string
}

function validarCampos(body: CorpoItem): string | null {
  const nome = body.name?.trim()
  if (!nome || nome.length > 120) {
    return 'Nome do item é obrigatório (até 120 caracteres).'
  }
  if (typeof body.price !== 'number' || Number.isNaN(body.price) || body.price < 0) {
    return 'Preço inválido.'
  }
  if (body.description && body.description.length > 500) {
    return 'Descrição muito longa (máx 500 caracteres).'
  }
  return null
}

async function tenantDoUsuario(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { erro: NextResponse.json({ error: 'Não autenticado.' }, { status: 401 }) }

  const { data: tenant } = await supabase.from('tenants').select('id').eq('user_id', user.id).single()
  if (!tenant) return { erro: NextResponse.json({ error: 'Catálogo não encontrado.' }, { status: 404 }) }

  return { tenantId: tenant.id }
}

export async function GET() {
  const supabase = await createClient()
  const resultado = await tenantDoUsuario(supabase)
  if (resultado.erro) return resultado.erro

  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, price, description, image_url, is_available_today, created_at')
    .eq('tenant_id', resultado.tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[items] Erro ao listar:', error.message)
    return NextResponse.json({ error: 'Erro ao carregar itens.' }, { status: 500 })
  }

  return NextResponse.json({ items })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const resultado = await tenantDoUsuario(supabase)
  if (resultado.erro) return resultado.erro

  let body: CorpoItem
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  const erroValidacao = validarCampos(body)
  if (erroValidacao) {
    return NextResponse.json({ error: erroValidacao }, { status: 400 })
  }

  const { data: item, error } = await supabase
    .from('items')
    .insert({
      tenant_id: resultado.tenantId,
      name: body.name!.trim(),
      price: body.price,
      description: body.description?.trim() || null,
      image_url: body.image_url || null,
    })
    .select('id, name, price, description, image_url, is_available_today, created_at')
    .single()

  if (error) {
    console.error('[items] Erro ao criar:', error.message)
    return NextResponse.json({ error: 'Erro ao criar item.' }, { status: 500 })
  }

  return NextResponse.json({ item })
}
