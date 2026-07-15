'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { linkPublico } from '@/lib/link-publico'
import { CompartilharBotao } from '@/components/CompartilharBotao'

export function AbaMeuLink({ slug, nomeNegocio }: { slug: string; nomeNegocio: string }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const url = linkPublico(slug)

  useEffect(() => {
    QRCode.toDataURL(url, { width: 240, margin: 1, color: { dark: '#1e293b', light: '#ffffff' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''))
  }, [url])

  return (
    <div className="space-y-5 text-center">
      <p className="text-sm text-slate-500">
        Esse é o link do seu catálogo. Mostre o QR code ou mande o link direto pra alguém.
      </p>

      <div className="flex justify-center">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL gerada no navegador, não é imagem de arquivo
          <img
            src={qrDataUrl}
            alt={`QR code do catálogo de ${nomeNegocio}`}
            className="w-48 h-48 rounded-xl border border-slate-200"
          />
        ) : (
          <div className="w-48 h-48 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
        )}
      </div>

      <p className="text-sm font-mono text-slate-600 break-all bg-slate-50 rounded-lg px-3 py-2">
        {url}
      </p>

      <CompartilharBotao
        url={url}
        titulo={nomeNegocio}
        texto={nomeNegocio}
        className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2"
      >
        Compartilhar
      </CompartilharBotao>
    </div>
  )
}
