'use client'

import { useState } from 'react'
import { X, MessageSquare, LayoutGrid, Globe } from 'lucide-react'
import { PERFIS_DEMO, type ItemDemo } from '@/lib/tutorial-demo-data'
import { chaveTutorialVisto } from '@/lib/tutorial-painel'
import { TelefoneSimulado } from '@/components/landing/TelefoneSimulado'
import { PainelDemoScreen } from '@/components/landing/PainelDemoScreen'
import { CatalogoDemoScreen } from '@/components/landing/CatalogoDemoScreen'

// Reaproveita o mesmo simulador interativo (dados fictícios) já usado na
// landing page, em vez de manter prints estáticos do painel — que ficam
// desatualizados toda vez que a interface muda de verdade.
const PERFIL_DEMO = PERFIS_DEMO[0]

type Tela = 'painel' | 'catalogo'

const CONTROLES: { id: Tela; label: string; icone: typeof LayoutGrid }[] = [
  { id: 'painel', label: 'Painel', icone: LayoutGrid },
  { id: 'catalogo', label: 'Catálogo do cliente', icone: Globe },
]

export function ModalComoUsar({ slug, onFechar }: { slug: string; onFechar: () => void }) {
  const [items, setItems] = useState<ItemDemo[]>(PERFIL_DEMO.items)
  const [corPrincipal, setCorPrincipal] = useState(PERFIL_DEMO.corPrincipal)
  const [corSecundaria, setCorSecundaria] = useState<string | null>(PERFIL_DEMO.corSecundaria)
  const [lojaAberta, setLojaAberta] = useState(PERFIL_DEMO.isOpen)
  const [tela, setTela] = useState<Tela>('painel')
  const [toast, setToast] = useState<{ titulo: string; sub: string } | null>(null)

  function mostrarToast(titulo: string, sub: string) {
    setToast({ titulo, sub })
    setTimeout(() => setToast(null), 4000)
  }

  function alternarItem(id: string) {
    setItems((atual) => atual.map((i) => (i.id === id ? { ...i, isAvailableToday: !i.isAvailableToday } : i)))
  }

  function fechar() {
    localStorage.setItem(chaveTutorialVisto(slug), '1')
    onFechar()
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Como usar</p>
        <button onClick={fechar} aria-label="Fechar" className="text-slate-400 hover:text-slate-600 p-1">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center overflow-y-auto px-4 pt-2 pb-6 gap-4">
        <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed">
          Esse é um catálogo de exemplo — clica à vontade pra testar. Não mexe na sua loja de verdade.
        </p>

        <div className="grid grid-cols-2 gap-2 w-full max-w-[320px]">
          {CONTROLES.map(({ id, label, icone: Icone }) => (
            <button
              key={id}
              onClick={() => setTela(id)}
              className={`py-2.5 px-2 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 border ${
                tela === id
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <Icone className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full flex items-center justify-center flex-shrink-0">
          {toast && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 bg-slate-900 border border-slate-700 text-white rounded-2xl py-2.5 px-4 shadow-2xl flex items-center gap-2.5 max-w-[280px] animate-fade-in">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 flex-shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-[11px]">{toast.titulo}</p>
                <p className="text-[9px] text-slate-400 leading-normal">{toast.sub}</p>
              </div>
            </div>
          )}

          <TelefoneSimulado>
            {tela === 'painel' && (
              <PainelDemoScreen
                perfil={PERFIL_DEMO}
                items={items}
                onToggleItem={alternarItem}
                corPrincipal={corPrincipal}
                corSecundaria={corSecundaria}
                onSetCorPrincipal={setCorPrincipal}
                onSetCorSecundaria={setCorSecundaria}
                lojaAberta={lojaAberta}
                onToggleLoja={() => setLojaAberta((v) => !v)}
                onVerCatalogo={() => setTela('catalogo')}
                onToast={mostrarToast}
              />
            )}
            {tela === 'catalogo' && (
              <CatalogoDemoScreen
                perfil={PERFIL_DEMO}
                items={items}
                corPrincipal={corPrincipal}
                corSecundaria={corSecundaria}
                lojaAberta={lojaAberta}
                onToast={mostrarToast}
              />
            )}
          </TelefoneSimulado>
        </div>
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={fechar}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition bg-slate-900 hover:bg-slate-800"
        >
          Entendi, já sei usar!
        </button>
      </div>
    </div>
  )
}
