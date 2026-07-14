'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

function formatarCpf(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatarWhatsapp(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  if (digitos.length <= 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '')
  }
  return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '')
}

export default function CadastroPage() {
  const router = useRouter()
  const [nomeNegocio, setNomeNegocio] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const resposta = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeNegocio, whatsapp, cpf, email, senha }),
      })
      const resultado = await resposta.json()

      if (!resposta.ok) {
        setErro(resultado.error ?? 'Não foi possível criar sua conta. Tente novamente.')
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) {
        // Conta criada, mas o login automático falhou — manda pro login normal
        router.push('/login')
        return
      }

      router.push('/painel')
      router.refresh()
    } catch {
      setErro('Não foi possível criar sua conta. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Olha Aí</h1>
          <p className="text-sm text-slate-500 mt-1">Crie seu catálogo em 1 minuto</p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-3">
          <input
            type="text"
            placeholder="Nome do seu negócio"
            value={nomeNegocio}
            onChange={(e) => setNomeNegocio(e.target.value)}
            required
            maxLength={120}
            className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
          />
          <input
            type="tel"
            placeholder="WhatsApp com DDD"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatarWhatsapp(e.target.value))}
            required
            className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(formatarCpf(e.target.value))}
            required
            inputMode="numeric"
            className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
          />
          <input
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
          />

          {erro && <p className="text-rose-600 text-xs text-center py-1">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-full py-4 text-sm font-medium tracking-wide mt-1 flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {loading ? (<><Loader2 size={14} className="animate-spin" /> Criando...</>) : 'Criar meu catálogo grátis'}
          </button>
        </form>

        <p className="text-center mt-5 text-xs text-slate-500">
          Já tem conta?{' '}
          <Link href="/login" className="text-teal-700 font-semibold">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
