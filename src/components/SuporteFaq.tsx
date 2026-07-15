'use client'

import { useState } from 'react'
import { MessageCircle, X, ChevronDown, Mail } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/faq-suporte'

export function SuporteFaq({ emailSuporte, nomeNegocio }: { emailSuporte: string | null; nomeNegocio: string }) {
  const [aberto, setAberto] = useState(false)
  const [expandido, setExpandido] = useState<number | null>(null)
  const [pergunta, setPergunta] = useState('')

  function enviarPorEmail() {
    if (!emailSuporte || !pergunta.trim()) return
    const assunto = encodeURIComponent(`Dúvida - Olha Aí (${nomeNegocio})`)
    const corpo = encodeURIComponent(pergunta.trim())
    window.location.href = `mailto:${emailSuporte}?subject=${assunto}&body=${corpo}`
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-3 shadow-lg hover:bg-slate-800 transition"
        aria-label="Abrir dúvidas frequentes"
      >
        <MessageCircle size={20} />
        <span className="text-sm font-medium">Ajuda</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-5 z-50 w-[340px] max-w-[calc(100vw-2.5rem)] h-[480px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white shrink-0">
        <span className="text-sm font-semibold">Dúvidas frequentes</span>
        <button onClick={() => setAberto(false)} aria-label="Fechar ajuda">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="divide-y divide-slate-200">
          {FAQ_ITEMS.map((item, i) => {
            const expandidoAtual = expandido === i
            return (
              <div key={i} className="bg-white">
                <button
                  onClick={() => setExpandido(expandidoAtual ? null : i)}
                  className="w-full flex items-center justify-between gap-2 text-left px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item.pergunta}
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform ${expandidoAtual ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandidoAtual && (
                  <p className="px-4 pb-3 text-sm text-slate-500 leading-relaxed">{item.resposta}</p>
                )}
              </div>
            )
          })}
        </div>

        {emailSuporte && (
          <div className="p-3 bg-amber-50 border-t border-amber-200 space-y-2">
            <p className="text-xs font-medium text-amber-900">Não achou o que precisava?</p>
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Escreva sua dúvida..."
              maxLength={500}
              rows={2}
              className="w-full text-sm px-3 py-2 rounded-lg border border-amber-200 outline-none focus:border-amber-400 bg-white resize-none"
            />
            <button
              onClick={enviarPorEmail}
              disabled={!pergunta.trim()}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-40 rounded-lg py-2 transition-colors"
            >
              <Mail size={14} /> Enviar por e-mail
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
