import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { corDeFundo } from '@/lib/paleta'
import { linkPublico } from '@/lib/link-publico'
import { CompartilharBotao } from '@/components/CompartilharBotao'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '600' })

type Item = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_available_today: boolean
}

function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function linkWhatsappItem(whatsapp: string, nomeNegocio: string, nomeItem: string): string {
  const mensagem = encodeURIComponent(`Oi! Vi seu catálogo no Olha Aí e quero pedir: ${nomeItem}`)
  return `https://wa.me/${whatsapp}?text=${mensagem}`
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
  return {
    title: dados.tenant.name,
    description: dados.tenant.bio ?? `Catálogo de ${dados.tenant.name} no Olha Aí`,
  }
}

export default async function PaginaPublicaCatalogo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dados = await buscarDados(slug)
  if (!dados) notFound()

  const { tenant, items } = dados

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header
        className="text-white px-6 pt-10 pb-8 text-center"
        style={{ background: corDeFundo(tenant.cor_principal, tenant.cor_secundaria) }}
      >
        {tenant.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
          <img
            src={tenant.logo_url}
            alt={tenant.name}
            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white/40 shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto border-4 border-white/40 shadow-lg bg-white/20 flex items-center justify-center text-3xl font-bold">
            {tenant.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="text-2xl font-bold mt-4">{tenant.name}</h1>
        {tenant.bio && <p className="text-sm opacity-90 mt-1 max-w-sm mx-auto">{tenant.bio}</p>}

        <div className="mt-4">
          <CompartilharBotao
            url={linkPublico(tenant.slug)}
            titulo={tenant.name}
            texto={`Dá uma olhada no catálogo de ${tenant.name}!`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-full"
          >
            Indicar pra alguém
          </CompartilharBotao>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-3">
        {items.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">
            Ainda não tem itens no catálogo.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-white ${
              item.is_available_today ? '' : 'opacity-50'
            }`}
          >
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
              <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{item.name}</p>
              <p className="text-sm text-slate-500">{formatarPreco(item.price)}</p>
              {item.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
              )}
              {!item.is_available_today && (
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Não tem hoje
                </span>
              )}
            </div>

            {item.is_available_today && (
              <a
                href={linkWhatsappItem(tenant.whatsapp, tenant.name, item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-xs font-semibold text-white px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
              >
                Pedir
              </a>
            )}
          </div>
        ))}
      </main>

      <footer className="py-6 text-center">
        <Link href="/" className={`${dancingScript.className} text-lg text-slate-300 hover:text-slate-400 transition`}>
          Olha Aí
        </Link>
      </footer>
    </div>
  )
}
