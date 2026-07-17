'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react'
import { PASSOS_TUTORIAL_PAINEL, chaveTutorialVisto } from '@/lib/tutorial-painel'

const TOQUE_MINIMO_SWIPE = 40

export function TutorialPainel({ slug, corPrincipal, onFechar }: { slug: string; corPrincipal: string; onFechar: () => void }) {
  const [passoAtual, setPassoAtual] = useState(0)
  const [toqueInicioX, setToqueInicioX] = useState<number | null>(null)

  const passo = PASSOS_TUTORIAL_PAINEL[passoAtual]
  const ultimoPasso = passoAtual === PASSOS_TUTORIAL_PAINEL.length - 1

  function fechar() {
    localStorage.setItem(chaveTutorialVisto(slug), '1')
    onFechar()
  }

  function avancar() {
    if (ultimoPasso) {
      fechar()
      return
    }
    setPassoAtual((atual) => atual + 1)
  }

  function voltar() {
    setPassoAtual((atual) => Math.max(0, atual - 1))
  }

  function aoTocarFim(e: React.TouchEvent) {
    if (toqueInicioX === null) return
    const diferenca = e.changedTouches[0].clientX - toqueInicioX
    if (diferenca <= -TOQUE_MINIMO_SWIPE) avancar()
    else if (diferenca >= TOQUE_MINIMO_SWIPE) voltar()
    setToqueInicioX(null)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex gap-1.5">
          {PASSOS_TUTORIAL_PAINEL.map((p) => (
            <span
              key={p.numero}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: p.numero - 1 === passoAtual ? 20 : 8,
                background: p.numero - 1 === passoAtual ? corPrincipal : '#e2e8f0',
              }}
            />
          ))}
        </div>
        <button onClick={fechar} aria-label="Fechar tutorial" className="text-slate-400 hover:text-slate-600 p-1">
          <X size={20} />
        </button>
      </div>

      <div
        className="flex-1 min-h-0 flex flex-col items-center justify-center px-8 text-center gap-4 overflow-y-auto py-4"
        onTouchStart={(e) => setToqueInicioX(e.touches[0].clientX)}
        onTouchEnd={aoTocarFim}
      >
        <div
          className="relative w-full max-w-[180px] flex-shrink-0 rounded-2xl overflow-hidden border-4 shadow-lg"
          style={{ borderColor: `${corPrincipal}33` }}
        >
          <Image
            src={passo.imagem}
            alt={passo.titulo}
            width={738}
            height={1600}
            className="w-full h-auto block"
          />
          {passo.alvo && (
            <div
              className="absolute animate-bounce"
              style={{ left: `${passo.alvo.x}%`, top: `${passo.alvo.y}%`, transform: 'translate(-50%, -100%)' }}
            >
              <ArrowDown
                size={26}
                strokeWidth={3.5}
                className="text-amber-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]"
              />
            </div>
          )}
        </div>
        <div className="space-y-2 max-w-xs flex-shrink-0">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Passo {passo.numero} de {PASSOS_TUTORIAL_PAINEL.length}
          </p>
          <h2 className="text-xl font-bold text-slate-800">{passo.titulo}</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{passo.descricao}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 pb-8 pt-2">
        <button
          onClick={voltar}
          disabled={passoAtual === 0}
          className="p-3 rounded-full text-slate-400 disabled:opacity-0 transition"
          aria-label="Passo anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={avancar}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition"
          style={{ background: corPrincipal }}
        >
          {ultimoPasso ? 'Entendi, vamos lá!' : 'Próximo'}
          {!ultimoPasso && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  )
}
