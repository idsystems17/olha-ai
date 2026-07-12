import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'

const TAMANHO_MAXIMO = 3 * 1024 * 1024 // 3MB — a foto já chega comprimida do cliente

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
