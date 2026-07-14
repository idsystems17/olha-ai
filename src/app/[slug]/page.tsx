import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { corDeFundo } from '@/lib/paleta'
import { linkPublico } from '@/lib/link-publico'
import { CompartilharBotao } from '@/components/CompartilharBotao'
import { CatalogoLista } from '@/components/CatalogoLista'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '600' })

type Item = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_available_today: boolean
}

function formatarWhatsappExibicao(numero: string): string {
  const digitos = numero.replace(/\D/g, '').replace(/^55/, '')
  if (digitos.length < 10) return numero
  const ddd = digitos.slice(0, 2)
  const resto = digitos.slice(2)
  return resto.length === 9
    ? `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`
    : `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`
}

async function buscarDados(slug: string) {
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants_publicos')
    .select('id, slug, name, logo_url, bio, cor_principal, cor_secundaria, whatsapp, is_open_today, is_active')
    .eq('slug', slug)
    .maybeSingle()

  if (!tenant || !tenant.is_active) return null

  const { data: items } = await supabase
    .from('items_publicos')
    .select('id, name, price, description, image_url, is_available_today')
    .eq('tenant_id', tenant.id)
    .order('is_available_today', { ascending: false })
    .order('name', { ascending: true })

  return { tenant, items: (items ?? []) as Item[] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dados = await buscarDados(slug)
  if (!dados) return { title: 'Olha Aí' }

  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  return {
    title: dados.tenant.name,
    description: dados.tenant.bio ?? `Catálogo de ${dados.tenant.name} no Olha Aí`,
    manifest: `${base}/api/manifest/${slug}`,
  }
}

export default async function PaginaPublicaCatalogo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dados = await buscarDados(slug)
  if (!dados) notFound()

  const { tenant, items } = dados

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div
        className="relative h-28"
        style={{ background: corDeFundo(tenant.cor_principal, tenant.cor_secundaria) }}
      >
        <div className="absolute top-4 right-4">
          <CompartilharBotao
            url={linkPublico(tenant.slug)}
            titulo={tenant.name}
            texto={`Dá uma olhada no catálogo de ${tenant.name}!`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <span className="sr-only">Indicar pra alguém</span>
          </CompartilharBotao>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg pt-14 pb-6 px-6 text-center relative">
          {tenant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
            <img
              src={tenant.logo_url}
              alt={tenant.name}
              className="w-24 h-24 rounded-full object-cover absolute -top-12 left-1/2 -translate-x-1/2 border-4 border-white shadow-lg"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full absolute -top-12 left-1/2 -translate-x-1/2 border-4 border-white shadow-lg text-white flex items-center justify-center text-3xl font-bold"
              style={{ background: corDeFundo(tenant.cor_principal, tenant.cor_secundaria) }}
            >
              {tenant.name.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-2xl font-bold text-slate-800">{tenant.name}</h1>
          {tenant.bio && <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">{tenant.bio}</p>}

          <hr className="border-slate-100 mt-5 mb-4" />

          <div className="flex items-center justify-center gap-6 text-xs">
            <div>
              <span className="text-slate-400">Status: </span>
              <span className={`font-bold ${tenant.is_open_today ? 'text-emerald-600' : 'text-rose-600'}`}>
                ● {tenant.is_open_today ? 'Aberto' : 'Fechado hoje'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">WhatsApp: </span>
              <span className="text-slate-700 font-bold">{formatarWhatsappExibicao(tenant.whatsapp)}</span>
            </div>
          </div>
        </div>
      </div>

      <CatalogoLista items={items} whatsapp={tenant.whatsapp} nomeNegocio={tenant.name} abertoHoje={tenant.is_open_today} />

      <footer className="py-6 text-center">
        <Link href="/" className={`${dancingScript.className} text-lg text-slate-300 hover:text-slate-400 transition`}>
          Olha Aí
        </Link>
      </footer>
    </div>
  )
}
