'use client'

import { useState } from 'react'
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
}

export function PainelClient({ tenant, itemsIniciais }: { tenant: Tenant; itemsIniciais: Item[] }) {
  const [aba, setAba] = useState<'cardapio' | 'aparencia' | 'meulink' | 'conta'>('cardapio')

  const abas = [
    { id: 'cardapio' as const, label: 'Cardápio' },
    { id: 'aparencia' as const, label: 'Aparência' },
    { id: 'meulink' as const, label: 'Meu link' },
    { id: 'conta' as const, label: 'Conta' },
  ]

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-5">
      <h1 className="text-lg font-bold text-slate-800">{tenant.name}</h1>
      <p className="text-xs text-slate-400 mb-4">olhaai.app/{tenant.slug}</p>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
        {abas.map((item) => (
          <button
            key={item.id}
            onClick={() => setAba(item.id)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              aba === item.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {aba === 'cardapio' && <AbaCardapio itemsIniciais={itemsIniciais} />}
      {aba === 'aparencia' && <AbaAparencia tenant={tenant} />}
      {aba === 'meulink' && <AbaMeuLink slug={tenant.slug} nomeNegocio={tenant.name} />}
      {aba === 'conta' && <AbaConta />}
    </div>
  )
}
