'use client'

import { useState, useSyncExternalStore } from 'react'
import { Layers, Palette, QrCode, UserCircle, Eye, PlayCircle } from 'lucide-react'
import { corDeFundo } from '@/lib/paleta'
import { linkPublico } from '@/lib/link-publico'
import { chaveTutorialVisto } from '@/lib/tutorial-painel'
import { AbaCardapio } from './AbaCardapio'
import { AbaAparencia } from './AbaAparencia'
import { AbaMeuLink } from './AbaMeuLink'
import { AbaConta } from './AbaConta'
import { InterruptorLoja } from './InterruptorLoja'
import { CartaoAssinatura } from './CartaoAssinatura'
import { TutorialPainel } from './TutorialPainel'

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
  is_open: boolean
  whatsapp: string
}

const ABAS = [
  { id: 'cardapio' as const, label: 'Cardápio', icone: Layers },
  { id: 'aparencia' as const, label: 'Aparência', icone: Palette },
  { id: 'meulink' as const, label: 'Meu link', icone: QrCode },
  { id: 'conta' as const, label: 'Conta', icone: UserCircle },
]

function inscreverStorage(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

// Sincroniza com o localStorage (sistema externo ao React) via useSyncExternalStore,
// em vez de useEffect + setState, pra não disparar uma renderização em cascata logo após montar.
function usePrimeiroAcesso(slug: string): boolean {
  return useSyncExternalStore(
    inscreverStorage,
    () => localStorage.getItem(chaveTutorialVisto(slug)) === null,
    () => false,
  )
}

export function PainelClient({
  tenant,
  itemsIniciais,
  diasRestantes,
  trialAcabou,
  linkCheckout,
  email,
}: {
  tenant: Tenant
  itemsIniciais: Item[]
  diasRestantes: number
  trialAcabou: boolean
  linkCheckout: string
  email: string
}) {
  const [aba, setAba] = useState<'cardapio' | 'aparencia' | 'meulink' | 'conta'>('cardapio')
  const [tutorialAbertoManual, setTutorialAbertoManual] = useState(false)
  const [tutorialFechadoAgora, setTutorialFechadoAgora] = useState(false)
  const fundo = corDeFundo(tenant.cor_principal, tenant.cor_secundaria)

  const primeiroAcesso = usePrimeiroAcesso(tenant.slug)
  const tutorialAberto = tutorialAbertoManual || (primeiroAcesso && !tutorialFechadoAgora)

  function fecharTutorial() {
    setTutorialAbertoManual(false)
    setTutorialFechadoAgora(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 flex flex-col">
      <header className="text-white px-4 py-4" style={{ background: fundo }}>
        <div className="max-w-md w-full mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Painel de controle</p>
            <h1 className="font-bold text-base leading-tight truncate">{tenant.name}</h1>
          </div>
          <a
            href={`/${tenant.slug}`}
            className="flex-shrink-0 bg-white/20 hover:bg-white/35 font-bold py-1.5 px-3 rounded-full text-xs flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver catálogo</span>
          </a>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto px-4 -mt-2 flex-1">
        <CartaoAssinatura
          isSubscribed={tenant.is_subscribed}
          diasRestantes={diasRestantes}
          trialAcabou={trialAcabou}
          linkCheckout={linkCheckout}
        />

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-xs text-slate-400 mb-1 truncate">{linkPublico(tenant.slug).replace(/^https?:\/\//, '')}</p>

          <button
            onClick={() => setTutorialAbertoManual(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 mb-4 transition"
          >
            <PlayCircle size={14} />
            Como usar o painel
          </button>

          <InterruptorLoja isOpenInicial={tenant.is_open} />

          {aba === 'cardapio' && <AbaCardapio itemsIniciais={itemsIniciais} />}
          {aba === 'aparencia' && <AbaAparencia tenant={tenant} />}
          {aba === 'meulink' && (
            <AbaMeuLink
              slug={tenant.slug}
              nomeNegocio={tenant.name}
              logoUrl={tenant.logo_url}
              corPrincipal={tenant.cor_principal}
              corSecundaria={tenant.cor_secundaria}
            />
          )}
          {aba === 'conta' && (
            <AbaConta whatsapp={tenant.whatsapp} email={email} isSubscribed={tenant.is_subscribed} />
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 shadow-lg z-40">
        {ABAS.map(({ id, label, icone: Icone }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAba(id)}
            className={`flex flex-col items-center gap-1 font-semibold text-[10px] transition ${
              aba === id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icone className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {tutorialAberto && (
        <TutorialPainel slug={tenant.slug} corPrincipal={tenant.cor_principal} onFechar={fecharTutorial} />
      )}
    </div>
  )
}
