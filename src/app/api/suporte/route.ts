import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAnthropicClient } from '@/lib/anthropic'
import { FAQ_SUPORTE } from '@/lib/faq-suporte'

const MARCA_ESCALAR = '<<ESCALAR>>'
const MAX_MENSAGENS = 12
const MAX_CARACTERES_MENSAGEM = 500

type MensagemChat = { role: 'user' | 'assistant'; content: string }

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  let body: { mensagens?: MensagemChat[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  const mensagens = body.mensagens
  if (!Array.isArray(mensagens) || mensagens.length === 0) {
    return NextResponse.json({ error: 'Envie ao menos uma mensagem.' }, { status: 400 })
  }
  if (mensagens.length > MAX_MENSAGENS) {
    return NextResponse.json({ error: 'Conversa muito longa. Fale direto com o suporte.' }, { status: 400 })
  }
  for (const m of mensagens) {
    if (
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.length === 0 ||
      m.content.length > MAX_CARACTERES_MENSAGEM
    ) {
      return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 })
    }
  }

  const anthropic = createAnthropicClient()

  let resposta: string
  try {
    const mensagem = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: FAQ_SUPORTE,
      messages: mensagens,
    })
    const bloco = mensagem.content.find((b) => b.type === 'text')
    resposta = bloco && bloco.type === 'text' ? bloco.text : ''
  } catch (erro) {
    console.error('[suporte] Erro ao chamar Anthropic:', erro)
    return NextResponse.json({ error: 'Suporte indisponível no momento. Tente de novo em instantes.' }, { status: 502 })
  }

  const escalar = resposta.includes(MARCA_ESCALAR)
  resposta = resposta.replace(MARCA_ESCALAR, '').trim()

  if (!resposta) {
    resposta = 'Não consegui responder isso por aqui.'
  }

  return NextResponse.json({ resposta, escalar })
}
