'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) {
        setErro('E-mail ou senha incorretos.')
        return
      }
      router.push('/painel')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Olha Aí</h1>
          <p className="text-sm text-slate-500 mt-1">Bem-vinda de volta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />
          <div className="relative">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 pr-11 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {erro && <p className="text-rose-600 text-xs text-center py-1">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-full py-4 text-sm font-medium tracking-wide mt-1 flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {loading ? (<><Loader2 size={14} className="animate-spin" /> Entrando...</>) : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-5">
          <Link href="/esqueci-senha" className="text-xs text-orange-600">Esqueceu a senha?</Link>
        </p>
        <p className="text-center mt-2 text-xs text-slate-500">
          Ainda não tem catálogo?{' '}
          <Link href="/cadastro" className="text-orange-600 font-semibold">Criar grátis</Link>
        </p>
      </div>
    </div>
  )
}
