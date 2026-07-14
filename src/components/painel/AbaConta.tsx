'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AbaConta() {
  const router = useRouter()
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [saindo, setSaindo] = useState(false)

  async function sair() {
    setSaindo(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function trocarSenha(e: React.FormEvent) {
    e.preventDefault()
    setMensagem('')

    if (novaSenha.length < 8) {
      setMensagem('❌ A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem('❌ As senhas não são iguais.')
      return
    }

    setSalvando(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        setMensagem('❌ Não foi possível confirmar sua conta. Saia e entre de novo.')
        return
      }

      // Confirma a senha atual antes de trocar, pra ninguém com a sessão
      // aberta esquecida trocar a senha sem saber a atual.
      const { error: erroReauth } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: senhaAtual,
      })
      if (erroReauth) {
        setMensagem('❌ Senha atual incorreta.')
        return
      }

      const { error: erroUpdate } = await supabase.auth.updateUser({ password: novaSenha })
      if (erroUpdate) {
        setMensagem('❌ Não foi possível trocar a senha. Tente de novo.')
        return
      }

      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      setMensagem('✅ Senha alterada!')
    } catch {
      setMensagem('❌ Não foi possível trocar a senha. Tente de novo.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={trocarSenha} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Senha atual</label>
        <input
          type="password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Nova senha</label>
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Confirmar nova senha</label>
        <input
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
        />
      </div>

      {mensagem && <p className="text-sm">{mensagem}</p>}

      <button
        type="submit"
        disabled={salvando}
        className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
      >
        {salvando ? 'Salvando...' : 'Trocar senha'}
      </button>

      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={sair}
          disabled={saindo}
          className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold disabled:opacity-50"
        >
          {saindo ? 'Saindo...' : 'Sair da conta'}
        </button>
      </div>
    </form>
  )
}
