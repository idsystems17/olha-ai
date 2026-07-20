'use client'

import { useState } from 'react'

export function InterruptorLoja({ isOpenInicial }: { isOpenInicial: boolean }) {
  const [aberto, setAberto] = useState(isOpenInicial)
  const [salvando, setSalvando] = useState(false)

  async function alternar() {
    const novoValor = !aberto
    setAberto(novoValor)
    setSalvando(true)

    const resposta = await fetch('/api/loja', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_open: novoValor }),
    })

    if (!resposta.ok) {
      setAberto(!novoValor)
    }
    setSalvando(false)
  }

  return (
    <div className="flex items-center justify-between gap-3 mb-4 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
      <div>
        <p className="text-sm font-semibold text-slate-700">
          {aberto ? 'Loja aberta' : 'Loja fechada'}
        </p>
        <p className="text-xs text-slate-400">
          {aberto ? 'Clientes conseguem pedir normalmente.' : 'Vitrine visível, mas ninguém consegue pedir.'}
        </p>
      </div>
      <button
        type="button"
        onClick={alternar}
        disabled={salvando}
        className={`flex-shrink-0 relative w-10 h-6 rounded-full transition-colors disabled:opacity-50 ${
          aberto ? 'bg-green-500' : 'bg-slate-300'
        }`}
        aria-label={aberto ? 'Loja aberta — clique pra fechar' : 'Loja fechada — clique pra abrir'}
        title={aberto ? 'Loja aberta' : 'Loja fechada'}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            aberto ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
