import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// AINDA EM VERIFICAÇÃO — essa etapa só confirma se a hipótese da assinatura
// (HMAC-SHA1 do corpo bruto, comparado com ?signature= na URL) está certa.
// A lógica de negócio (atualizar assinatura do tenant, idempotência) vem
// depois de confirmar isso com um teste real da Kiwify.
function assinaturaValida(corpoBruto: string, assinaturaRecebida: string): boolean {
  const segredo = process.env.KIWIFY_WEBHOOK_SECRET
  if (!segredo || !assinaturaRecebida) return false

  const esperada = createHmac('sha1', segredo).update(corpoBruto).digest('hex')
  const bufEsperada = Buffer.from(esperada, 'utf8')
  const bufRecebida = Buffer.from(assinaturaRecebida, 'utf8')

  if (bufEsperada.length !== bufRecebida.length) return false
  return timingSafeEqual(bufEsperada, bufRecebida)
}

export async function POST(request: NextRequest) {
  const assinaturaRecebida = request.nextUrl.searchParams.get('signature') ?? ''
  const corpoBruto = await request.text()

  const valida = assinaturaValida(corpoBruto, assinaturaRecebida)

  if (!valida) {
    console.warn('[kiwify-webhook][VERIFICAÇÃO] Assinatura NÃO bateu com a hipótese HMAC-SHA1.')
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let evento = '(corpo não é JSON válido)'
  try {
    evento = JSON.parse(corpoBruto).webhook_event_type ?? '(sem webhook_event_type)'
  } catch {
    // corpo não era JSON — só pra log, sem problema
  }

  console.log('[kiwify-webhook][VERIFICAÇÃO] Assinatura bateu! webhook_event_type:', evento)
  return NextResponse.json({ ok: true })
}
