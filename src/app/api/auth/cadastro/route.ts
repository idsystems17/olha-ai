import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify, SLUGS_RESERVADOS } from '@/lib/slug'
import { normalizarCpf, hashCpf } from '@/lib/cpf'

function normalizarWhatsapp(whatsapp: string): string {
  return whatsapp.replace(/\D/g, '')
}

export async function POST(request: NextRequest) {
  let body: { nomeNegocio?: string; whatsapp?: string; cpf?: string; email?: string; senha?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  const nomeNegocio = body.nomeNegocio?.trim()
  const email = body.email?.toLowerCase().trim()
  const senha = body.senha
  const cpf = body.cpf ? normalizarCpf(body.cpf) : ''
  const whatsapp = body.whatsapp ? normalizarWhatsapp(body.whatsapp) : ''

  if (!nomeNegocio || !email || !senha || !cpf || !whatsapp) {
    return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 })
  }
  if (nomeNegocio.length > 120) {
    return NextResponse.json({ error: 'Nome do negócio muito longo.' }, { status: 400 })
  }
  if (senha.length < 8) {
    return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 })
  }
  if (cpf.length !== 11) {
    return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 })
  }
  if (whatsapp.length < 10 || whatsapp.length > 11) {
    return NextResponse.json({ error: 'WhatsApp inválido. Use DDD + número.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const cpfHash = hashCpf(cpf)

  // Anti-abuso: CPF já usado antes (mesmo que o catálogo anterior já tenha sido excluído).
  // Só o hash é comparado — o CPF em texto puro nunca é gravado no banco.
  const { data: cpfExistente } = await admin
    .from('cpf_usados')
    .select('cpf_hash')
    .eq('cpf_hash', cpfHash)
    .maybeSingle()

  if (cpfExistente) {
    return NextResponse.json({
      error: 'Este CPF já foi usado para criar um catálogo antes.',
      code: 'cpf_usado',
    }, { status: 409 })
  }

  // Gera um slug único a partir do nome do negócio
  let slug = slugify(nomeNegocio)
  if (SLUGS_RESERVADOS.has(slug)) {
    slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`
  }
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const candidato = tentativa === 0 ? slug : `${slug}-${Math.floor(1000 + Math.random() * 9000)}`
    const { data: slugExistente } = await admin
      .from('tenants')
      .select('id')
      .eq('slug', candidato)
      .maybeSingle()
    if (!slugExistente) {
      slug = candidato
      break
    }
    if (tentativa === 4) {
      return NextResponse.json({ error: 'Não foi possível gerar um link único. Tente novamente.' }, { status: 500 })
    }
  }

  // Cria o usuário via admin (sem exigir confirmação de e-mail — fricção mínima)
  const { data: novoUser, error: erroCriacao } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome_negocio: nomeNegocio },
  })

  if (erroCriacao || !novoUser.user) {
    if (erroCriacao?.message.toLowerCase().includes('already been registered') ||
        erroCriacao?.message.toLowerCase().includes('already exists')) {
      return NextResponse.json({
        error: 'Este e-mail já possui uma conta. Faça login ou redefina sua senha.',
        code: 'email_exists',
      }, { status: 409 })
    }
    console.error('[cadastro] Erro ao criar usuário:', erroCriacao?.message)
    return NextResponse.json({ error: 'Erro ao criar conta. Tente novamente.' }, { status: 500 })
  }

  const userId = novoUser.user.id

  const { error: erroTenant } = await admin.from('tenants').insert({
    user_id: userId,
    name: nomeNegocio,
    slug,
    whatsapp,
    cpf_hash: cpfHash,
  })

  if (erroTenant) {
    // Reverte a criação do usuário se o catálogo não puder ser criado
    await admin.auth.admin.deleteUser(userId)
    console.error('[cadastro] Erro ao criar tenant:', erroTenant.message)
    return NextResponse.json({ error: 'Erro ao criar catálogo. Tente novamente.' }, { status: 500 })
  }

  await admin.from('cpf_usados').insert({ cpf_hash: cpfHash })

  return NextResponse.json({ ok: true, slug })
}
