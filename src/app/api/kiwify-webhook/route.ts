import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TEMPORÁRIO — só pra descobrir o formato real que a Kiwify manda (headers,
// query string, corpo) antes de escrever a validação de segurança de verdade
// (HMAC/token + idempotência, conforme SEGURANCA.md). NÃO valida nada ainda —
// não é a versão final, só um diagnóstico até confirmarmos o formato.
export async function POST(request: NextRequest) {
  const url = request.url
  const headers = Object.fromEntries(request.headers.entries())
  const body = await request.text()

  console.log('[kiwify-webhook][DIAGNÓSTICO] URL completa:', url)
  console.log('[kiwify-webhook][DIAGNÓSTICO] Headers:', JSON.stringify(headers, null, 2))
  console.log('[kiwify-webhook][DIAGNÓSTICO] Corpo:', body)

  return NextResponse.json({ ok: true })
}
