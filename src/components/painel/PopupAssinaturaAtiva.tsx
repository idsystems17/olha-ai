'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'

export function PopupAssinaturaAtiva() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    if (searchParams.get('assinatura') === 'ativada') {
      setAberto(true)
      router.replace('/painel')
    }
  }, [searchParams, router])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
          <Check size={24} />
        </div>
        <h2 className="font-bold text-slate-800 text-lg">Sua assinatura está ativa!</h2>
        <p className="text-sm text-slate-500 mt-1.5">
          Seu catálogo continua no ar pros seus clientes. Obrigada por assinar o Olha Aí.
        </p>
        <button
          onClick={() => setAberto(false)}
          className="mt-5 w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
