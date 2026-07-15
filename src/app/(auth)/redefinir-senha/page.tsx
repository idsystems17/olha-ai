'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Eye, EyeOff } from 'lucide-react'

function RedefinirSenhaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sessaoValida, setSessaoValida] = useState<boolean | null>(null)

  const erroParam = searchParams.get('erro')

  useEffect(() => {
    createClient().auth.getSession()
      .then(({ data }) => setSessaoValida(!!data.session))
      .catch(() => setSessaoValida(false))
  }, [])

  async function handleRedefinir(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      setLoading(false)
      return
    }
    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: senha })
      if (error) {
        setErro('Ocorreu um erro ao salvar a senha. O link pode ter expirado.')
        return
      }
      router.push('/painel')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const cardBase = 'min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-200 via-orange-50 to-rose-200'

  if (erroParam === 'link-invalido' || sessaoValida === false) {
    return (
      <div className={cardBase}>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Olha Aí</h1>
          <p className="text-sm text-rose-600 bg-rose-50 rounded-xl p-3 mt-4">
            Este link é inválido ou já expirou.
          </p>
          <a href="/esqueci-senha" className="inline-flex mt-5 bg-orange-500 text-white rounded-full px-6 py-3 text-sm font-medium">
            Solicitar novo link
          </a>
        </div>
      </div>
    )
  }

  if (sessaoValida === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className={cardBase}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Olha Aí</h1>
          <p className="text-sm text-slate-500 mt-1">Definir nova senha</p>
        </div>

        <form onSubmit={handleRedefinir} className="space-y-3">
          <div className="relative">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={8}
              className="w-full bg-slate-50 rounded-xl py-3.5 px-4 pr-11 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-300 transition-all"
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
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            minLength={8}
            className="w-full bg-slate-50 rounded-xl py-3.5 px-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-300 transition-all"
          />

          {erro && <p className="text-rose-600 text-xs text-center py-1">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-full py-4 text-sm font-medium tracking-wide mt-1 flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            {loading ? (<><Loader2 size={14} className="animate-spin" /> Salvando...</>) : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-slate-400" /></div>}>
      <RedefinirSenhaContent />
    </Suspense>
  )
}
