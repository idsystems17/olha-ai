'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatarWhatsappVisual } from '@/lib/whatsapp'

export function AbaConta({ whatsapp, email }: { whatsapp: string; email: string }) {
  const router = useRouter()
  const [novoWhatsapp, setNovoWhatsapp] = useState(formatarWhatsappVisual(whatsapp))
  const [salvandoWhatsapp, setSalvandoWhatsapp] = useState(false)
  const [mensagemWhatsapp, setMensagemWhatsapp] = useState('')

  const [novoEmail, setNovoEmail] = useState(email)
  const [salvandoEmail, setSalvandoEmail] = useState(false)
  const [mensagemEmail, setMensagemEmail] = useState('')

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [saindo, setSaindo] = useState(false)

  async function salvarWhatsapp(e: React.FormEvent) {
    e.preventDefault()
    setMensagemWhatsapp('')
    setSalvandoWhatsapp(true)
    try {
      const resposta = await fetch('/api/conta', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: novoWhatsapp }),
      })
      const dados = await resposta.json()
      if (!resposta.ok) {
        setMensagemWhatsapp(`❌ ${dados.error ?? 'Erro ao salvar.'}`)
        return
      }
      setNovoWhatsapp(formatarWhatsappVisual(dados.tenant.whatsapp))
      setMensagemWhatsapp('✅ WhatsApp atualizado!')
    } catch {
      setMensagemWhatsapp('❌ Não foi possível salvar. Tente de novo.')
    } finally {
      setSalvandoWhatsapp(false)
    }
  }

  async function salvarEmail(e: React.FormEvent) {
    e.preventDefault()
    setMensagemEmail('')

    if (novoEmail.trim().toLowerCase() === email.toLowerCase()) {
      setMensagemEmail('')
      return
    }

    setSalvandoEmail(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ email: novoEmail.trim().toLowerCase() })
      if (error) {
        setMensagemEmail('❌ Não foi possível trocar o e-mail. Tente de novo.')
        return
      }
      setMensagemEmail('✅ E-mail atualizado! Se pedir confirmação, ela chega na caixa de entrada.')
    } catch {
      setMensagemEmail('❌ Não foi possível trocar o e-mail. Tente de novo.')
    } finally {
      setSalvandoEmail(false)
    }
  }

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
    <div className="space-y-6">
      <form onSubmit={salvarWhatsapp} className="space-y-3 pb-5 border-b border-slate-100">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">WhatsApp</label>
          <input
            type="tel"
            value={novoWhatsapp}
            onChange={(e) => setNovoWhatsapp(formatarWhatsappVisual(e.target.value))}
            required
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
          />
        </div>
        {mensagemWhatsapp && <p className="text-sm">{mensagemWhatsapp}</p>}
        <button
          type="submit"
          disabled={salvandoWhatsapp}
          className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
        >
          {salvandoWhatsapp ? 'Salvando...' : 'Salvar WhatsApp'}
        </button>
      </form>

      <form onSubmit={salvarEmail} className="space-y-3 pb-5 border-b border-slate-100">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">E-mail de login</label>
          <input
            type="email"
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
          />
        </div>
        {mensagemEmail && <p className="text-sm">{mensagemEmail}</p>}
        <button
          type="submit"
          disabled={salvandoEmail}
          className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
        >
          {salvandoEmail ? 'Salvando...' : 'Salvar e-mail'}
        </button>
      </form>

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
    </div>
  )
}
