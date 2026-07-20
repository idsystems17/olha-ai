'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { formatarWhatsappVisual } from '@/lib/whatsapp'

// Réplica visual do formulário real de /cadastro (mesmos campos e mesma
// regra de negócio: CPF anti-abuso, 30 dias grátis sem cartão). Não manda
// nada pra lugar nenhum — é só o gostinho de como é rápido criar a conta.
function formatarCpfDemo(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function CadastroDemoScreen({ onConcluir }: { onConcluir: (nomeNegocio: string) => void }) {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [cpf, setCpf] = useState('')

  return (
    <div className="bg-white h-full p-5 flex flex-col justify-center text-left animate-fade-in overflow-y-auto">
      <div className="mb-4">
        <span className="text-[10px] bg-orange-50 text-orange-600 font-extrabold py-1 px-3 rounded-full border border-orange-100 uppercase">
          Passo único
        </span>
        <h2 className="text-xl font-bold text-slate-800 mt-2">Criar meu catálogo</h2>
        <p className="text-xs text-slate-400 mt-1">Sua página profissional em menos de 1 minuto.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onConcluir(nome.trim() || 'Meu Negócio')
        }}
        className="space-y-3"
      >
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Como quer ser chamada?
          </label>
          <input
            type="text"
            required
            placeholder="ex: Cida, Zé, Dona Maria..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-700 outline-none focus:border-orange-300"
          />
          <p className="text-[9px] text-slate-400">
            Usamos seu nome (não o do produto) porque seu link não muda mesmo se você trocar o que vende.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            WhatsApp com DDD
          </label>
          <input
            type="tel"
            required
            placeholder="(11) 99999-8888"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatarWhatsappVisual(e.target.value))}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-700 outline-none focus:border-orange-300 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            CPF
          </label>
          <input
            type="text"
            required
            placeholder="123.456.789-00"
            value={cpf}
            onChange={(e) => setCpf(formatarCpfDemo(e.target.value))}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-700 outline-none focus:border-orange-300 font-mono"
          />
          <p className="text-[9px] text-slate-400">1 conta grátis por CPF — evita abuso do teste.</p>
        </div>

        <p className="text-[10px] text-slate-300">+ e-mail e senha, pra você acessar depois.</p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-normal">
            <strong>30 dias grátis completos</strong>, sem pedir cartão de crédito.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md text-xs transition-colors"
        >
          Criar meu catálogo grátis
        </button>
      </form>
    </div>
  )
}
