import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
