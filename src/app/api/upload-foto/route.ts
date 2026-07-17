import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'

const TAMANHO_MAXIMO = 3 * 1024 * 1024 // 3MB — a foto já chega comprimida do cliente

// O header Content-Type do upload é só o que o navegador declarou — fácil de
// forjar. Confere também os primeiros bytes reais do arquivo (magic number),
// pra garantir que é imagem de verdade antes de aceitar.
async function pareceImagemValida(file: File): Promise<boolean> {
  const cabecalho = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const comeca = (assinatura: number[], offset = 0) =>
    assinatura.every((byte, i) => cabecalho[offset + i] === byte)

  if (comeca([0xff, 0xd8, 0xff])) return true // JPEG
  if (comeca([0x89, 0x50, 0x4e, 0x47])) return true // PNG
  if (comeca([0x47, 0x49, 0x46, 0x38])) return true // GIF
  if (comeca([0x52, 0x49, 0x46, 0x46]) && comeca([0x57, 0x45, 0x42, 0x50], 8)) return true // WebP
  return false
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!tenant) {
    return NextResponse.json({ error: 'Catálogo não encontrado.' }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Envie apenas imagens.' }, { status: 400 })
  }
  if (file.size > TAMANHO_MAXIMO) {
    return NextResponse.json({ error: 'Imagem muito grande.' }, { status: 400 })
  }
  if (!(await pareceImagemValida(file))) {
    return NextResponse.json({ error: 'Arquivo não parece ser uma imagem válida.' }, { status: 400 })
  }

  const caminho = `${tenant.id}/${randomUUID()}.jpg`

  const { error: erroUpload } = await supabase.storage
    .from('fotos')
    .upload(caminho, file, { contentType: 'image/jpeg', upsert: false })

  if (erroUpload) {
    console.error('[upload-foto] Erro ao subir pro Storage:', erroUpload.message)
    return NextResponse.json({ error: 'Erro ao enviar a foto. Tente de novo.' }, { status: 500 })
  }

  const { data: publicUrl } = supabase.storage.from('fotos').getPublicUrl(caminho)

  return NextResponse.json({ url: publicUrl.publicUrl })
}
