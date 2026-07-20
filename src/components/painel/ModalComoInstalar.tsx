'use client'

import Image from 'next/image'
import { X } from 'lucide-react'

export function ModalComoInstalar({ corPrincipal, onFechar }: { corPrincipal: string; onFechar: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Como instalar</p>
        <button onClick={onFechar} aria-label="Fechar" className="text-slate-400 hover:text-slate-600 p-1">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-8 text-center gap-4 overflow-y-auto py-4">
        <div
          className="relative w-full max-w-[200px] flex-shrink-0 rounded-2xl overflow-hidden border-4 shadow-lg"
          style={{ borderColor: `${corPrincipal}33` }}
        >
          <Image
            src="/tutorial/instalar-atalho.jpg"
            alt="Menu do navegador com a opção 'Instalar e criar atalho' em destaque"
            width={704}
            height={1600}
            className="w-full h-auto block"
          />
        </div>
        <div className="space-y-3 max-w-xs flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Deixe o painel na tela inicial</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            No Android: toque nos três pontinhos (⋮) do navegador e escolha{' '}
            <strong className="text-slate-700">&quot;Instalar e criar atalho&quot;</strong>. Assim o painel abre
            direto, como um aplicativo.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            No iPhone: toque no ícone de compartilhar do Safari e escolha{' '}
            <strong className="text-slate-700">&quot;Adicionar à Tela de Início&quot;</strong>.
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          onClick={onFechar}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition"
          style={{ background: corPrincipal }}
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
