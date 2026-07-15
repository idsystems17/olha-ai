import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { corDeFundo } from '@/lib/paleta'
import { linkPublico } from '@/lib/link-publico'
import { CompartilharBotao } from '@/components/CompartilharBotao'
import { CatalogoItens } from '@/components/CatalogoItens'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '600' })

type Item = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_available_today: boolean
}

function formatarWhatsappExibicao(digitos: string): string {
  const ddd = digitos.slice(0, 2)
  const resto = digitos.slice(2)
  const meio = resto.length === 9 ? resto.slice(0, 5) : resto.slice(0, 4)
  const fim = resto.length === 9 ? resto.slice(5) : resto.slice(4)
  return `(${ddd}) ${meio}-${fim}`
}

async function buscarDados(slug: string) {
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants_publicos')
    .select('id, slug, name, logo_url, bio, cor_principal, cor_secundaria, whatsapp, is_active')
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
  const fundo = corDeFundo(tenant.cor_principal, tenant.cor_secundaria)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full pt-8 pb-16 px-4 relative" style={{ background: fundo }}>
        <div className="absolute top-4 right-4">
          <CompartilharBotao
            url={linkPublico(tenant.slug)}
            titulo={tenant.name}
            texto={`Dá uma olhada no catálogo de ${tenant.name}!`}
            className="bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm p-2 rounded-full transition"
          >
            <span className="sr-only">Compartilhar</span>
          </CompartilharBotao>
        </div>
      </div>

      <div className="px-4 -mt-10 mb-4 relative z-10 max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 flex flex-col items-center text-center">
          {tenant.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
            <img
              src={tenant.logo_url}
              alt={tenant.name}
              className="w-20 h-20 rounded-full object-cover -mt-12 border-4 border-white shadow-md bg-white"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl -mt-12 border-4 border-white shadow-md"
              style={{ background: fundo }}
            >
              {tenant.name.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="font-bold text-slate-800 text-lg mt-2 leading-tight">{tenant.name}</h1>
          {tenant.bio && <p className="text-slate-500 text-xs mt-1 leading-relaxed px-2">{tenant.bio}</p>}

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50 w-full justify-center text-[11px] text-slate-400 flex-wrap">
            <span>
              Status: <span className="text-emerald-500 font-bold">● Aberto</span>
            </span>
            <span>•</span>
            <span>
              WhatsApp: <span className="text-slate-600 font-semibold">{formatarWhatsappExibicao(tenant.whatsapp)}</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-md w-full mx-auto px-4">
        <CatalogoItens items={items} whatsapp={tenant.whatsapp} />
      </main>

      <div className="px-4 py-6 mt-4 max-w-md w-full mx-auto">
        <CompartilharBotao
          url={linkPublico(tenant.slug)}
          titulo={tenant.name}
          texto={`Dá uma olhada no catálogo de ${tenant.name}!`}
          className="w-full border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition"
        >
          Indicar esse catálogo pra alguém
        </CompartilharBotao>
      </div>

      <footer className="py-6 text-center">
        <Link href="/" className={`${dancingScript.className} text-lg text-slate-300 hover:text-slate-400 transition`}>
          Olha Aí
        </Link>
      </footer>
    </div>
  )
}
