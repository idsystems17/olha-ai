'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'

export function CartaoAssinatura({
  isSubscribed,
  diasRestantes,
  trialAcabou,
  linkCheckout,
}: {
  isSubscribed: boolean
  diasRestantes: number
  trialAcabou: boolean
  linkCheckout: string
}) {
  const [visivel, setVisivel] = useState(true)

  if (!visivel) return null

  return (
    <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 relative mb-3">
      <button
        type="button"
        onClick={() => setVisivel(false)}
        aria-label="Fechar aviso"
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
      >
        <X size={14} />
      </button>

      <div className="flex gap-2 items-start pr-4">
        <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
        <div>
          {isSubscribed ? (
            <>
              <p className="text-xs font-bold text-slate-800 leading-tight">Assinatura ativa (R$ 19,90/mês)</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                Sua conta está segura e ativa. Obrigada por confiar no Olha Aí!
              </p>
            </>
          ) : trialAcabou ? (
            <>
              <p className="text-xs font-bold text-slate-800 leading-tight">Seu período grátis acabou</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                Seu catálogo está fora do ar pros clientes. Se não assinar logo, seus dados (fotos e
                cardápio) serão apagados.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                Faltam {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'} de teste grátis
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                Depois disso, assine por R$ 19,90/mês pra continuar no ar.
              </p>
            </>
          )}
        </div>
      </div>

      {!isSubscribed && (
        <a
          href={linkCheckout}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1 mt-2"
        >
          <span>Assinar agora — R$ 19,90/mês</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      )}
    </div>
  )
}
