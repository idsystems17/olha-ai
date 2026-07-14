import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PALETA } from '@/lib/paleta'

type CorpoAparencia = {
  name?: string
  bio?: string
  logo_url?: string
  cor_principal?: string
  cor_secundaria?: string | null
  is_open_today?: boolean
}

const HEXES_PERMITIDOS = new Set<string>(PALETA.map((c) => c.hex))

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  let body: CorpoAparencia
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  const atualizacao: CorpoAparencia = {}

  if (body.name !== undefined) {
    const nome = body.name.trim()
    if (!nome || nome.length > 120) {
      return NextResponse.json({ error: 'Nome do negócio é obrigatório (até 120 caracteres).' }, { status: 400 })
    }
    atualizacao.name = nome
  }
  if (body.bio !== undefined) {
    if (body.bio.length > 200) {
      return NextResponse.json({ error: 'Bio muito longa (máx 200 caracteres).' }, { status: 400 })
    }
    atualizacao.bio = body.bio.trim() || undefined
  }
  if (body.logo_url !== undefined) {
    atualizacao.logo_url = body.logo_url
  }
  if (body.cor_principal !== undefined) {
    if (!HEXES_PERMITIDOS.has(body.cor_principal)) {
      return NextResponse.json({ error: 'Cor principal inválida.' }, { status: 400 })
    }
    atualizacao.cor_principal = body.cor_principal
  }
  if (body.cor_secundaria !== undefined) {
    if (body.cor_secundaria !== null && !HEXES_PERMITIDOS.has(body.cor_secundaria)) {
      return NextResponse.json({ error: 'Cor secundária inválida.' }, { status: 400 })
    }
    atualizacao.cor_secundaria = body.cor_secundaria
  }
  if (body.is_open_today !== undefined) {
    if (typeof body.is_open_today !== 'boolean') {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
    }
    atualizacao.is_open_today = body.is_open_today
  }

  if (Object.keys(atualizacao).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar.' }, { status: 400 })
  }

  const { data: tenant, error } = await supabase
    .from('tenants')
    .update(atualizacao)
    .eq('user_id', user.id)
    .select('name, bio, logo_url, cor_principal, cor_secundaria, is_open_today')
    .single()

  if (error || !tenant) {
    console.error('[aparencia] Erro ao atualizar:', error?.message)
    return NextResponse.json({ error: 'Erro ao salvar alterações.' }, { status: 500 })
  }

  return NextResponse.json({ tenant })
}
