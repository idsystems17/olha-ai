'use client'

import { useState } from 'react'
import { Search, MessageCircle } from 'lucide-react'

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

export function CatalogoLista({
  items,
  whatsapp,
  nomeNegocio,
  abertoHoje,
}: {
  items: Item[]
  whatsapp: string
  nomeNegocio: string
  abertoHoje: boolean
}) {
  const [busca, setBusca] = useState('')

  const itemsFiltrados = busca.trim()
    ? items.filter((item) => item.name.toLowerCase().includes(busca.trim().toLowerCase()))
    : items

  return (
    <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 pb-6 space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Procurando alguma coisa?"
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm"
        />
      </div>

      {!abertoHoje && (
        <p className="text-center text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl py-2.5 px-3">
          Fechado hoje — volte mais tarde pra fazer seu pedido.
        </p>
      )}

      {itemsFiltrados.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-10">
          {items.length === 0 ? 'Ainda não tem itens no catálogo.' : 'Nenhum item encontrado.'}
        </p>
      )}

      {itemsFiltrados.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-3 rounded-2xl border border-slate-100 shadow-sm p-3 bg-white ${
            item.is_available_today ? '' : 'opacity-60'
          }`}
        >
          {item.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
            <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-800">{item.name}</p>
              <span
                className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                  item.is_available_today ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {item.is_available_today ? 'Tem hoje' : 'Acabou'}
              </span>
            </div>
            {item.description && (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm font-bold text-slate-800">{formatarPreco(item.price)}</p>
              {item.is_available_today && abertoHoje && (
                <a
                  href={linkWhatsappItem(whatsapp, nomeNegocio, item.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 transition"
                >
                  <MessageCircle size={13} />
                  Pedir
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </main>
  )
}
