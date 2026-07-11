'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
      })
      // Mensagem genérica sempre igual, exista ou não o e-mail — evita
      // enumeração de usuários (ver SEGURANCA.md)
      setEnviado(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Olha Aí</h1>
          <p className="text-sm text-slate-500 mt-1">Recuperar senha</p>
        </div>

        {enviado ? (
          <div className="text-center flex flex-col items-center gap-3">
            <CheckCircle size={44} className="text-emerald-500" strokeWidth={1.5} />
            <p className="text-sm text-slate-600 leading-relaxed">
              Se esse e-mail tiver uma conta, você vai receber um link de recuperação em instantes.
            </p>
            <Link href="/login" className="text-sm text-orange-600 font-semibold flex items-center gap-1 mt-2">
              <ArrowLeft size={14} /> Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleEnviar} className="space-y-3">
            <p className="text-sm text-slate-500 text-center mb-2">
              Digite seu e-mail e enviaremos um link pra redefinir sua senha.
            </p>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-full py-4 text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              {loading ? (<><Loader2 size={14} className="animate-spin" /> Enviando...</>) : 'Enviar link de recuperação'}
            </button>
            <p className="text-center">
              <Link href="/login" className="text-xs text-slate-500">← Voltar para o login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
