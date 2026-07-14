'use client'

import { useState } from 'react'
import { Eye, Sparkles, X, ArrowRight, Layers, Palette, QrCode, User } from 'lucide-react'
import { corDeFundo } from '@/lib/paleta'
import { AbaCardapio } from './AbaCardapio'
import { AbaAparencia } from './AbaAparencia'
import { AbaMeuLink } from './AbaMeuLink'
import { AbaConta } from './AbaConta'

type Item = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_available_today: boolean
}

type Tenant = {
  name: string
  slug: string
  bio: string | null
  logo_url: string | null
  cor_principal: string
  cor_secundaria: string | null
  is_subscribed: boolean
  is_open_today: boolean
}

export function PainelClient({
  tenant,
  itemsIniciais,
  diasDeTrialRestantes,
  linkCheckout,
}: {
  tenant: Tenant
  itemsIniciais: Item[]
  diasDeTrialRestantes: number
  linkCheckout: string
}) {
  const [aba, setAba] = useState<'cardapio' | 'aparencia' | 'meulink' | 'conta'>('cardapio')
  const [bannerFechado, setBannerFechado] = useState(false)
  const [aberto, setAberto] = useState(tenant.is_open_today)
  const [salvandoStatus, setSalvandoStatus] = useState(false)

  const mostrarBannerTrial = !tenant.is_subscribed && diasDeTrialRestantes > 0 && !bannerFechado

  async function alternarStatus() {
    const novoValor = !aberto
    setAberto(novoValor)
    setSalvandoStatus(true)

    const resposta = await fetch('/api/aparencia', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_open_today: novoValor }),
    })

    setSalvandoStatus(false)
    if (!resposta.ok) setAberto(!novoValor)
  }

  const abas = [
    { id: 'cardapio' as const, label: 'Cardápio', Icone: Layers },
    { id: 'aparencia' as const, label: 'Aparência', Icone: Palette },
    { id: 'meulink' as const, label: 'Meu link', Icone: QrCode },
    { id: 'conta' as const, label: 'Conta', Icone: User },
  ]

  return (
    <div className="max-w-md mx-auto">
      <div
        className="rounded-b-3xl px-6 pt-8 pb-8 text-white flex items-start justify-between gap-3"
        style={{ background: corDeFundo(tenant.cor_principal, tenant.cor_secundaria) }}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Painel de controle</p>
          <h1 className="text-2xl font-bold leading-tight mt-1">{tenant.name}</h1>
        </div>
        <a
          href={`/${tenant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition px-3.5 py-2.5 rounded-full whitespace-nowrap"
        >
          <Eye size={14} />
          Ver Catálogo
        </a>
      </div>

      <div className="px-4 -mt-4 relative z-10 space-y-4">
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-4 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${aberto ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800">Catálogo {aberto ? 'aberto' : 'fechado'} hoje</p>
              <p className="text-xs text-slate-400">Clientes veem esse status na sua página</p>
            </div>
          </div>
          <button
            onClick={alternarStatus}
            disabled={salvandoStatus}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-60 ${
              aberto ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
            aria-label={aberto ? 'Marcar catálogo como fechado hoje' : 'Marcar catálogo como aberto hoje'}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                aberto ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {mostrarBannerTrial && (
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 relative">
            <button
              onClick={() => setBannerFechado(true)}
              aria-label="Fechar aviso"
              className="absolute top-3 right-3 text-amber-400 hover:text-amber-600"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-2 pr-6">
              <Sparkles size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-slate-800">
                Você tem {diasDeTrialRestantes} {diasDeTrialRestantes === 1 ? 'dia grátis' : 'dias grátis'} de Trial
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              No fim do teste, se não assinar, o catálogo é excluído para simplificar. Ative sua assinatura
              para não perder nada.
            </p>
            <a
              href={linkCheckout}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-full bg-slate-900 text-white text-sm font-semibold py-3"
            >
              Ativar Assinatura por R$ 19,90/mês
              <ArrowRight size={15} />
            </a>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-5">
          {aba === 'cardapio' && <AbaCardapio itemsIniciais={itemsIniciais} />}
          {aba === 'aparencia' && <AbaAparencia tenant={tenant} />}
          {aba === 'meulink' && <AbaMeuLink slug={tenant.slug} nomeNegocio={tenant.name} />}
          {aba === 'conta' && <AbaConta />}
        </div>
      </div>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          {abas.map(({ id, label, Icone }) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${
                aba === id ? 'text-teal-700' : 'text-slate-400'
              }`}
              aria-label={label}
            >
              <Icone size={20} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
