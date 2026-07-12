'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'
import { PALETA, corDeFundo } from '@/lib/paleta'

type Tenant = {
  name: string
  bio: string | null
  logo_url: string | null
  cor_principal: string
  cor_secundaria: string | null
}

export function AbaAparencia({ tenant }: { tenant: Tenant }) {
  const [nome, setNome] = useState(tenant.name)
  const [bio, setBio] = useState(tenant.bio ?? '')
  const [logo, setLogo] = useState(tenant.logo_url ?? '')
  const [corPrincipal, setCorPrincipal] = useState(tenant.cor_principal)
  const [corSecundaria, setCorSecundaria] = useState<string | null>(tenant.cor_secundaria)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function salvar() {
    if (!nome.trim()) {
      setMensagem('❌ Dê um nome pro seu negócio.')
      return
    }

    setSalvando(true)
    setMensagem('')

    try {
      const resposta = await fetch('/api/aparencia', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome.trim(),
          bio,
          logo_url: logo,
          cor_principal: corPrincipal,
          cor_secundaria: corSecundaria,
        }),
      })
      const dados = await resposta.json()

      if (!resposta.ok) {
        setMensagem(`❌ ${dados.error ?? 'Erro ao salvar.'}`)
        return
      }
      setMensagem('✅ Salvo!')
    } catch {
      setMensagem('❌ Não foi possível salvar. Tente de novo.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-5">
      <ImageUploader value={logo} onChange={setLogo} label="Foto de capa" />

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Nome do negócio</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={120}
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">
          Bio <span className="text-slate-400 font-normal">({bio.length}/200)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="Conte um pouco sobre o que você vende"
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400 resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-2">Cor principal</label>
        <div className="flex flex-wrap gap-2">
          {PALETA.map((cor) => (
            <button
              key={cor.hex}
              type="button"
              onClick={() => setCorPrincipal(cor.hex)}
              title={cor.nome}
              aria-label={`Cor principal: ${cor.nome}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cor.hex }}
            >
              {corPrincipal === cor.hex && <Check size={16} className="text-white drop-shadow" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-2">Cor secundária (opcional)</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCorSecundaria(null)}
            title="Sem cor secundária"
            aria-label="Sem cor secundária"
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border-2 bg-white ${
              corSecundaria === null ? 'border-slate-700' : 'border-slate-200'
            }`}
          >
            <X size={14} className="text-slate-400" />
          </button>
          {PALETA.map((cor) => (
            <button
              key={cor.hex}
              type="button"
              onClick={() => setCorSecundaria(cor.hex)}
              title={cor.nome}
              aria-label={`Cor secundária: ${cor.nome}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cor.hex }}
            >
              {corSecundaria === cor.hex && <Check size={16} className="text-white drop-shadow" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-2">Prévia</label>
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: corDeFundo(corPrincipal, corSecundaria) }}
        >
          <p className="font-bold text-lg">{nome || 'Nome do seu negócio'}</p>
          <p className="text-sm opacity-90 mt-1">{bio || 'Sua bio aparece aqui'}</p>
        </div>
      </div>

      {mensagem && <p className="text-sm">{mensagem}</p>}

      <button
        onClick={salvar}
        disabled={salvando}
        className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
      >
        {salvando ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </div>
  )
}
