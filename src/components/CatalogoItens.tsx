'use client'

import { useState } from 'react'
import { MessageSquare, Search, ShoppingBag } from 'lucide-react'
import { linkWhatsapp } from '@/lib/whatsapp'

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

function linkWhatsappItem(whatsapp: string, nomeItem: string): string {
  return linkWhatsapp(whatsapp, `Oi! Vi seu catálogo no Olha Aí e quero pedir: ${nomeItem}`)
}

export function CatalogoItens({
  items,
  whatsapp,
  lojaAberta,
}: {
  items: Item[]
  whatsapp: string
  lojaAberta: boolean
}) {
  const [busca, setBusca] = useState('')

  const alvo = busca.trim().toLowerCase()
  const filtrados = alvo
    ? items.filter(
        (item) =>
          item.name.toLowerCase().includes(alvo) || (item.description ?? '').toLowerCase().includes(alvo)
      )
    : items

  if (items.length === 0) {
    return <p className="text-center text-sm text-slate-400 py-10">Ainda não tem itens no catálogo.</p>
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Procurando alguma coisa?"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-300 shadow-xs"
        />
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 px-6">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">Nenhum item encontrado</h3>
          <p className="text-xs text-slate-400 mt-1">Tente procurar com outro termo.</p>
        </div>
      )}

      {filtrados.map((item) => (
        <div
          key={item.id}
          className={`bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex gap-3 ${
            item.is_available_today ? '' : 'opacity-70'
          }`}
        >
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-7 h-7" />
              </div>
            )}
            {!item.is_available_today && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white uppercase tracking-wide px-1.5 py-0.5 border border-white/50 rounded">
                  Indisponível
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
            <div>
              <div className="flex justify-between items-start gap-1">
                <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{item.name}</h3>
                {item.is_available_today ? (
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0">
                    Disponível
                  </span>
                ) : (
                  <span className="text-[9px] bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0">
                    Indisponível
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
              <span className="font-bold text-slate-800 text-sm">{formatarPreco(item.price)}</span>
              {item.is_available_today && lojaAberta ? (
                <a
                  href={linkWhatsappItem(whatsapp, item.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold py-1.5 px-3 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 transition"
                >
                  <MessageSquare className="w-3 h-3" />
                  Pedir
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="text-[10px] font-bold py-1.5 px-3 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                >
                  {lojaAberta ? 'Avisar quando tiver' : 'Fechado no momento'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
