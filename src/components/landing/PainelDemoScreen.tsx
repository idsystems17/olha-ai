'use client'

import { useState } from 'react'
import {
  Eye, PlayCircle, Layers, Palette, QrCode, UserCircle, Plus, Check, X,
  Copy, Download, Sparkles, ArrowRight, MessageCircle, Mail,
} from 'lucide-react'
import { PALETA, corDeFundo } from '@/lib/paleta'
import type { ItemDemo, PerfilDemo } from '@/lib/tutorial-demo-data'

type Aba = 'cardapio' | 'aparencia' | 'meulink' | 'conta'

const ABAS: { id: Aba; label: string; icone: typeof Layers }[] = [
  { id: 'cardapio', label: 'Cardápio', icone: Layers },
  { id: 'aparencia', label: 'Aparência', icone: Palette },
  { id: 'meulink', label: 'Meu link', icone: QrCode },
  { id: 'conta', label: 'Conta', icone: UserCircle },
]

function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PainelDemoScreen({
  perfil,
  items,
  onToggleItem,
  corPrincipal,
  corSecundaria,
  onSetCorPrincipal,
  onSetCorSecundaria,
  lojaAberta,
  onToggleLoja,
  onVerCatalogo,
  onToast,
}: {
  perfil: PerfilDemo
  items: ItemDemo[]
  onToggleItem: (id: string) => void
  corPrincipal: string
  corSecundaria: string | null
  onSetCorPrincipal: (hex: string) => void
  onSetCorSecundaria: (hex: string | null) => void
  lojaAberta: boolean
  onToggleLoja: () => void
  onVerCatalogo: () => void
  onToast: (titulo: string, sub: string) => void
}) {
  const [aba, setAba] = useState<Aba>('cardapio')
  const fundo = corDeFundo(corPrincipal, corSecundaria)

  return (
    <div className="bg-slate-50 h-full flex flex-col animate-fade-in">
      <header className="text-white px-4 py-4 flex-shrink-0" style={{ background: fundo }}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-80">Painel de controle</p>
            <h1 className="font-bold text-sm leading-tight truncate">{perfil.name}</h1>
          </div>
          <button
            onClick={onVerCatalogo}
            className="flex-shrink-0 bg-white/20 hover:bg-white/35 font-bold py-1.5 px-2.5 rounded-full text-[10px] flex items-center gap-1 transition"
          >
            <Eye className="w-3 h-3" />
            <span>Ver catálogo</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 -mt-2 pb-2">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 mb-3">
          <div className="flex gap-2 items-start">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            {perfil.isSubscribed ? (
              <div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">Assinatura ativa (R$ 19,90/mês)</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Sua conta está segura e ativa.</p>
              </div>
            ) : (
              <div className="flex-1">
                <p className="text-[11px] font-bold text-slate-800 leading-tight">
                  Faltam {perfil.diasRestantes} dias de teste grátis
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">Depois, R$ 19,90/mês pra continuar no ar.</p>
                <button
                  onClick={() => onToast('Assinar agora', 'No app de verdade isso abriria o checkout — R$ 19,90/mês.')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-[9px] transition-all flex items-center justify-center gap-1 mt-2"
                >
                  <span>Assinar agora</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-[10px] text-slate-400 mb-1 truncate">olhaai.app/{perfil.slug}</p>

          <button
            onClick={() => onToast('Como usar o painel', 'Aqui abriria o tutorial passo a passo de dentro do painel real.')}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold mb-3 transition hover:brightness-95"
            style={{ background: `${corPrincipal}1a`, color: corPrincipal }}
          >
            <PlayCircle size={14} />
            Como usar o painel
          </button>

          <div className="flex items-center justify-between gap-3 mb-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-700">{lojaAberta ? 'Loja aberta' : 'Loja fechada'}</p>
              <p className="text-[10px] text-slate-400">
                {lojaAberta ? 'Clientes conseguem pedir.' : 'Cardápio visível, mas ninguém pede.'}
              </p>
            </div>
            <button
              onClick={onToggleLoja}
              className={`flex-shrink-0 relative w-9 h-5 rounded-full transition-colors ${lojaAberta ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${lojaAberta ? 'translate-x-4' : ''}`}
              />
            </button>
          </div>

          {aba === 'cardapio' && (
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500">
                <Plus size={14} />
                Adicionar item
              </button>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-2 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail pequeno de demonstração, não é LCP */}
                  <img src={item.imageUrl} alt={item.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{formatarPreco(item.price)}</p>
                  </div>
                  <button
                    onClick={() => onToggleItem(item.id)}
                    title={item.isAvailableToday ? 'Disponível' : 'Indisponível'}
                    className={`flex-shrink-0 relative w-9 h-5 rounded-full transition-colors ${item.isAvailableToday ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.isAvailableToday ? 'translate-x-4' : ''}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {aba === 'aparencia' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1.5">Cor principal</label>
                <div className="flex flex-wrap gap-1.5">
                  {PALETA.map((cor) => (
                    <button
                      key={cor.hex}
                      onClick={() => onSetCorPrincipal(cor.hex)}
                      title={cor.nome}
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cor.hex }}
                    >
                      {corPrincipal === cor.hex && <Check size={12} className="text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1.5">
                  Cor secundária (opcional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => onSetCorSecundaria(null)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border-2 bg-white ${corSecundaria === null ? 'border-slate-700' : 'border-slate-200'}`}
                  >
                    <X size={10} className="text-slate-400" />
                  </button>
                  {PALETA.map((cor) => (
                    <button
                      key={cor.hex}
                      onClick={() => onSetCorSecundaria(cor.hex)}
                      title={cor.nome}
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cor.hex }}
                    >
                      {corSecundaria === cor.hex && <Check size={12} className="text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1.5">Prévia</label>
                <div className="rounded-xl p-3.5 text-white" style={{ background: fundo }}>
                  <p className="font-bold text-sm">{perfil.name}</p>
                  <p className="text-[10px] opacity-90 mt-0.5">{perfil.bio}</p>
                </div>
              </div>
            </div>
          )}

          {aba === 'meulink' && (
            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <div className="relative bg-white p-3 rounded-2xl border border-slate-200 inline-block">
                  <svg viewBox="0 0 100 100" className="w-28 h-28" fill={corPrincipal}>
                    <path d="M0,0 h25 v25 h-25 z M4,4 h17 v17 h-17 z M8,8 h9 v9 h-9 z" />
                    <path d="M75,0 h25 v25 h-25 z M79,4 h17 v17 h-17 z M83,8 h9 v9 h-9 z" />
                    <path d="M0,75 h25 v25 h-25 z M4,79 h17 v17 h-17 z M8,83 h9 v9 h-9 z" />
                    <path d="M30,20 h10 v4 h-10 z M45,15 h4 v8 h-4 z M55,20 h4 v4 h-4 z M30,32 h4 v4 h-4 z" />
                    <path d="M65,30 h10 v4 h-10 z M80,30 h4 v8 h-4 z M70,40 h4 v4 h-4 z M85,45 h10 v4 h-10 z" />
                    <path d="M30,45 h10 v4 h-10 z M45,40 h4 v12 h-4 z M55,50 h4 v4 h-4 z" />
                    <path d="M0,30 h12 v4 h-12 z M12,40 h8 v4 h-8 z M16,50 h4 v8 h-4 z" />
                    <rect x="38" y="38" width="24" height="24" rx="3" fill="white" />
                  </svg>
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center text-white font-extrabold text-[10px]"
                    style={{ background: corPrincipal }}
                  >
                    {perfil.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">olhaai.app/{perfil.slug}</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToast('Link copiado!', 'O link público do catálogo foi copiado.')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-[10px] font-semibold"
                >
                  <Copy size={13} />
                  Copiar link
                </button>
                <button
                  onClick={() => onToast('Compartilhar', 'Aqui abriria o menu nativo de compartilhamento do celular.')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 text-white text-[10px] font-semibold"
                >
                  Compartilhar
                </button>
              </div>
              <button
                onClick={() => onToast('QR code', 'Aqui baixaria a imagem do QR code, pronta pra imprimir.')}
                className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-1 mx-auto"
              >
                <Download size={12} />
                Baixar QR code
              </button>
            </div>
          )}

          {aba === 'conta' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <MessageCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">WhatsApp</p>
                  <p className="text-xs text-slate-700 truncate">{perfil.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">E-mail</p>
                  <p className="text-xs text-slate-700 truncate">contato@{perfil.slug}.com</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center pt-1">
                {perfil.isSubscribed ? 'Assinatura ativa · R$ 19,90/mês' : `Teste grátis · ${perfil.diasRestantes} dias restantes`}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-shrink-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around px-1">
        {ABAS.map(({ id, label, icone: Icone }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`flex flex-col items-center gap-0.5 font-semibold text-[9px] transition ${aba === id ? 'text-slate-900' : 'text-slate-400'}`}
          >
            <Icone className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
