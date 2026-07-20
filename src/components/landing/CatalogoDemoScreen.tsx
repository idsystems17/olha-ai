'use client'

import { useState } from 'react'
import { Search, MessageSquare, ShoppingBag, Share2 } from 'lucide-react'
import { corDeFundo } from '@/lib/paleta'
import type { ItemDemo, PerfilDemo } from '@/lib/tutorial-demo-data'

function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function CatalogoDemoScreen({
  perfil,
  items,
  corPrincipal,
  corSecundaria,
  lojaAberta,
  onToast,
}: {
  perfil: PerfilDemo
  items: ItemDemo[]
  corPrincipal: string
  corSecundaria: string | null
  lojaAberta: boolean
  onToast: (titulo: string, sub: string) => void
}) {
  const [busca, setBusca] = useState('')
  const fundo = corDeFundo(corPrincipal, corSecundaria)

  const alvo = busca.trim().toLowerCase()
  const filtrados = alvo
    ? items.filter((item) => item.name.toLowerCase().includes(alvo) || item.description.toLowerCase().includes(alvo))
    : items

  function pedir(item: ItemDemo) {
    const mensagem = `Oi! Vi seu catálogo no Olha Aí e quero pedir: ${item.name}`
    onToast('Isso abriria seu WhatsApp', `Mensagem pronta: "${mensagem}"`)
  }

  return (
    <div className="bg-slate-50 h-full flex flex-col animate-fade-in overflow-y-auto">
      <div className="w-full pt-6 pb-12 px-4 relative flex-shrink-0" style={{ background: fundo }}>
        <button
          onClick={() => onToast('Compartilhar', 'Aqui abriria o menu nativo de compartilhamento do celular.')}
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm p-1.5 rounded-full transition"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-3 -mt-8 mb-3 relative z-10">
        <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail pequeno de demonstração, não é LCP */}
          <img
            src={perfil.logoUrl}
            alt={perfil.name}
            className="w-16 h-16 rounded-full object-cover -mt-9 border-4 border-white shadow-md bg-white"
          />
          <h1 className="font-bold text-slate-800 text-sm mt-1.5 leading-tight">{perfil.name}</h1>
          <p className="text-slate-500 text-[10px] mt-1 leading-relaxed px-2">{perfil.bio}</p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50 w-full justify-center text-[9px] text-slate-400">
            <span>
              {lojaAberta ? (
                <span className="text-emerald-500 font-bold">● Aberto</span>
              ) : (
                <span className="text-slate-400 font-bold">● Fechado</span>
              )}
            </span>
            <span>•</span>
            <span>WhatsApp: {perfil.whatsapp}</span>
          </div>
        </div>
      </div>

      <main className="px-3 flex-1">
        {!lojaAberta && (
          <p className="text-center text-[10px] text-slate-500 bg-slate-100 border border-slate-200 rounded-xl py-2 px-3 mb-2.5">
            A loja está fechada — dá pra ver o cardápio, mas não pra pedir agora.
          </p>
        )}

        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurando alguma coisa?"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-slate-300 shadow-xs"
          />
        </div>

        <div className="space-y-2 pb-4">
          {filtrados.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 px-4">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-700">Nenhum item encontrado</p>
            </div>
          )}

          {filtrados.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex gap-2.5 ${item.isAvailableToday ? '' : 'opacity-70'}`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail pequeno de demonstração, não é LCP */}
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                {!item.isAvailableToday && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white uppercase px-1 py-0.5 border border-white/50 rounded">
                      Indisponível
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="font-bold text-slate-800 text-xs leading-tight line-clamp-1">{item.name}</h3>
                    {item.isAvailableToday ? (
                      <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full font-bold uppercase flex-shrink-0">
                        Disponível
                      </span>
                    ) : (
                      <span className="text-[8px] bg-slate-100 text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded-full font-bold uppercase flex-shrink-0">
                        Indisponível
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                </div>

                <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-50">
                  <span className="font-bold text-slate-800 text-xs">{formatarPreco(item.price)}</span>
                  {item.isAvailableToday && lojaAberta ? (
                    <button
                      onClick={() => pedir(item)}
                      className="text-[9px] font-bold py-1 px-2.5 rounded-lg bg-green-600 text-white flex items-center gap-1 hover:bg-green-700 transition"
                    >
                      <MessageSquare className="w-2.5 h-2.5" />
                      Pedir
                    </button>
                  ) : (
                    <span className="text-[9px] font-bold py-1 px-2.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200">
                      {lojaAberta ? 'Avisar quando tiver' : 'Fechado'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
