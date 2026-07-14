'use client'

import { useState } from 'react'
import { AbaCardapio } from './AbaCardapio'
import { AbaAparencia } from './AbaAparencia'
import { AbaMeuLink } from './AbaMeuLink'

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
}

export function PainelClient({ tenant, itemsIniciais }: { tenant: Tenant; itemsIniciais: Item[] }) {
  const [aba, setAba] = useState<'cardapio' | 'aparencia' | 'meulink'>('cardapio')

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-5">
      <h1 className="text-lg font-bold text-slate-800">{tenant.name}</h1>
      <p className="text-xs text-slate-400 mb-4">olhaai.app/{tenant.slug}</p>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
        <button
          onClick={() => setAba('cardapio')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            aba === 'cardapio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Cardápio
        </button>
        <button
          onClick={() => setAba('aparencia')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            aba === 'aparencia' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Aparência
        </button>
        <button
          onClick={() => setAba('meulink')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            aba === 'meulink' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Meu link
        </button>
      </div>

      {aba === 'cardapio' && <AbaCardapio itemsIniciais={itemsIniciais} />}
      {aba === 'aparencia' && <AbaAparencia tenant={tenant} />}
      {aba === 'meulink' && <AbaMeuLink slug={tenant.slug} nomeNegocio={tenant.name} />}
    </div>
  )
}
