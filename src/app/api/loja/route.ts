import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  let body: { is_open?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  if (typeof body.is_open !== 'boolean') {
    return NextResponse.json({ error: 'is_open precisa ser true ou false.' }, { status: 400 })
  }

  const { data: tenant, error } = await supabase
    .from('tenants')
    .update({ is_open: body.is_open })
    .eq('user_id', user.id)
    .select('is_open')
    .single()

  if (error || !tenant) {
    console.error('[loja] Erro ao atualizar is_open:', error?.message)
    return NextResponse.json({ error: 'Erro ao salvar.' }, { status: 500 })
  }

  return NextResponse.json({ tenant })
}
