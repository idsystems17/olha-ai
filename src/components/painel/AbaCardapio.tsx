'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'

type Item = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_available_today: boolean
}

function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function AbaCardapio({ itemsIniciais }: { itemsIniciais: Item[] }) {
  const [items, setItems] = useState<Item[]>(itemsIniciais)
  const [editando, setEditando] = useState<Item | null>(null)
  const [formAberto, setFormAberto] = useState(false)
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  function abrirNovo() {
    setEditando(null)
    setNome('')
    setPreco('')
    setDescricao('')
    setImagem('')
    setErro('')
    setFormAberto(true)
  }

  function abrirEdicao(item: Item) {
    setEditando(item)
    setNome(item.name)
    setPreco(String(item.price))
    setDescricao(item.description ?? '')
    setImagem(item.image_url ?? '')
    setErro('')
    setFormAberto(true)
  }

  function fecharForm() {
    setFormAberto(false)
    setEditando(null)
  }

  async function salvar() {
    const precoNumero = Number(preco.replace(',', '.'))
    if (!nome.trim()) {
      setErro('Dê um nome pro item.')
      return
    }
    if (Number.isNaN(precoNumero) || precoNumero < 0) {
      setErro('Preço inválido.')
      return
    }

    setSalvando(true)
    setErro('')

    const corpo = {
      name: nome.trim(),
      price: precoNumero,
      description: descricao.trim(),
      image_url: imagem,
    }

    try {
      const resposta = await fetch(editando ? `/api/items/${editando.id}` : '/api/items', {
        method: editando ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      })
      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.error ?? 'Erro ao salvar.')
        return
      }

      if (editando) {
        setItems((atual) => atual.map((i) => (i.id === dados.item.id ? dados.item : i)))
      } else {
        setItems((atual) => [dados.item, ...atual])
      }
      fecharForm()
    } catch {
      setErro('Não foi possível salvar. Tente de novo.')
    } finally {
      setSalvando(false)
    }
  }

  async function togglarDisponibilidade(item: Item) {
    const novoValor = !item.is_available_today
    setItems((atual) => atual.map((i) => (i.id === item.id ? { ...i, is_available_today: novoValor } : i)))

    const resposta = await fetch(`/api/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available_today: novoValor }),
    })

    if (!resposta.ok) {
      setItems((atual) => atual.map((i) => (i.id === item.id ? { ...i, is_available_today: !novoValor } : i)))
    }
  }

  async function excluir(item: Item) {
    if (!confirm(`Excluir "${item.name}"? Não dá pra desfazer.`)) return

    const anteriores = items
    setItems((atual) => atual.filter((i) => i.id !== item.id))

    const resposta = await fetch(`/api/items/${item.id}`, { method: 'DELETE' })
    if (!resposta.ok) {
      setItems(anteriores)
      alert('Não foi possível excluir. Tente de novo.')
    }
  }

  return (
    <div className="space-y-4">
      {!formAberto && (
        <button
          onClick={abrirNovo}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700 transition"
        >
          <Plus size={18} />
          Adicionar item
        </button>
      )}

      {formAberto && (
        <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">
              {editando ? 'Editar item' : 'Novo item'}
            </h3>
            <button onClick={fecharForm} aria-label="Fechar" className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>

          <ImageUploader value={imagem} onChange={setImagem} label="Foto do item" />

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={120}
              placeholder="Ex: Bolo de chocolate"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Preço</label>
            <input
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Descrição (opcional)</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Conte um pouco sobre o item"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-slate-400 resize-none"
            />
          </div>

          {erro && <p className="text-xs text-red-600">{erro}</p>}

          <button
            onClick={salvar}
            disabled={salvando}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && !formAberto && (
          <p className="text-sm text-slate-400 text-center py-6">
            Nenhum item ainda. Adicione o primeiro acima.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5 bg-white"
          >
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
              <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
              <p className="text-xs text-slate-500">{formatarPreco(item.price)}</p>
            </div>

            <button
              onClick={() => togglarDisponibilidade(item)}
              className={`flex-shrink-0 relative w-10 h-6 rounded-full transition-colors ${
                item.is_available_today ? 'bg-green-500' : 'bg-slate-300'
              }`}
              aria-label={item.is_available_today ? 'Disponível — clique pra desligar' : 'Indisponível — clique pra ligar'}
              title={item.is_available_today ? 'Disponível' : 'Indisponível'}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  item.is_available_today ? 'translate-x-4' : ''
                }`}
              />
            </button>

            <button onClick={() => abrirEdicao(item)} className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-700" aria-label="Editar">
              <Pencil size={16} />
            </button>
            <button onClick={() => excluir(item)} className="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-600" aria-label="Excluir">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
