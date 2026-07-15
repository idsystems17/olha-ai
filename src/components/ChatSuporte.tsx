'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

type Mensagem = { role: 'user' | 'assistant'; content: string }

const MENSAGEM_INICIAL: Mensagem = {
  role: 'assistant',
  content: 'Oi! Sou o suporte do Olha Aí. Pode perguntar o que precisar sobre como usar o app.',
}

export function ChatSuporte({ linkWhatsappSuporte }: { linkWhatsappSuporte: string | null }) {
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState<Mensagem[]>([MENSAGEM_INICIAL])
  const [texto, setTexto] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [escalar, setEscalar] = useState(false)
  const fimDaListaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, aberto])

  async function enviar() {
    const conteudo = texto.trim()
    if (!conteudo || carregando) return

    const historico = [...mensagens, { role: 'user' as const, content: conteudo }]
    setMensagens(historico)
    setTexto('')
    setCarregando(true)

    try {
      const resposta = await fetch('/api/suporte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagens: historico }),
      })
      const dados = await resposta.json()

      if (!resposta.ok) {
        setMensagens((atual) => [...atual, { role: 'assistant', content: dados.error ?? 'Algo deu errado.' }])
        return
      }

      setMensagens((atual) => [...atual, { role: 'assistant', content: dados.resposta }])
      if (dados.escalar) setEscalar(true)
    } catch {
      setMensagens((atual) => [...atual, { role: 'assistant', content: 'Não consegui me conectar agora. Tente de novo.' }])
    } finally {
      setCarregando(false)
    }
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-3 shadow-lg hover:bg-slate-800 transition"
        aria-label="Abrir chat de suporte"
      >
        <MessageCircle size={20} />
        <span className="text-sm font-medium">Suporte</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-5 z-50 w-[340px] max-w-[calc(100vw-2.5rem)] h-[480px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
        <span className="text-sm font-semibold">Suporte Olha Aí</span>
        <button onClick={() => setAberto(false)} aria-label="Fechar chat">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-slate-50">
        {mensagens.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === 'user'
                ? 'ml-auto bg-slate-900 text-white'
                : 'mr-auto bg-white border border-slate-200 text-slate-700'
            }`}
          >
            {m.content}
          </div>
        ))}
        {carregando && (
          <div className="mr-auto bg-white border border-slate-200 text-slate-400 rounded-xl px-3 py-2 text-sm">
            digitando...
          </div>
        )}
        <div ref={fimDaListaRef} />
      </div>

      {escalar && linkWhatsappSuporte && (
        <div className="px-3 py-2 bg-amber-50 border-t border-amber-200">
          <a
            href={linkWhatsappSuporte}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm font-medium text-amber-800 hover:underline"
          >
            Falar direto com o suporte no WhatsApp →
          </a>
        </div>
      )}

      <div className="flex items-center gap-2 p-2 border-t border-slate-200">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder="Digite sua dúvida..."
          maxLength={500}
          disabled={carregando}
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
        />
        <button
          onClick={enviar}
          disabled={carregando || !texto.trim()}
          aria-label="Enviar mensagem"
          className="p-2 rounded-lg bg-slate-900 text-white disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>

      {linkWhatsappSuporte && !escalar && (
        <a
          href={linkWhatsappSuporte}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs text-slate-400 hover:text-slate-600 pb-2"
        >
          Prefere falar direto no WhatsApp?
        </a>
      )}
    </div>
  )
}
