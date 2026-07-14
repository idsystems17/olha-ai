'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

type Props = {
  url: string
  titulo: string
  texto?: string
  className?: string
  children: React.ReactNode
}

export function CompartilharBotao({ url, titulo, texto, className, children }: Props) {
  const [copiado, setCopiado] = useState(false)

  async function compartilhar() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url })
      } catch {
        // usuária cancelou o compartilhamento nativo — não faz nada
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // clipboard indisponível nesse navegador — sem fallback melhor aqui
    }
  }

  return (
    <button type="button" onClick={compartilhar} className={className}>
      {copiado ? <Check size={16} /> : <Share2 size={16} />}
      {copiado ? 'Link copiado!' : children}
    </button>
  )
}
