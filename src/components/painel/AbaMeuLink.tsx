'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Check, Download } from 'lucide-react'
import { linkPublico } from '@/lib/link-publico'
import { corDeFundo } from '@/lib/paleta'
import { CompartilharBotao } from '@/components/CompartilharBotao'

type Props = {
  slug: string
  nomeNegocio: string
  logoUrl: string | null
  corPrincipal: string
  corSecundaria: string | null
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Gera o QR code na cor escolhida, com a inicial do negócio no centro. Usa
// nível de correção de erro alto (H) justamente pra tolerar esse "buraco"
// no meio sem perder a leitura — desenhado só com formas/texto (sem foto
// real), pra nunca esbarrar em CORS do Supabase Storage e travar o canvas.
async function gerarQrComBadge(url: string, corPrincipal: string, inicial: string): Promise<string> {
  const tamanho = 480
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: tamanho,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: corPrincipal, light: '#ffffff' },
  })

  const canvas = document.createElement('canvas')
  canvas.width = tamanho
  canvas.height = tamanho
  const ctx = canvas.getContext('2d')
  if (!ctx) return qrDataUrl

  const imgQr = await carregarImagem(qrDataUrl)
  ctx.drawImage(imgQr, 0, 0, tamanho, tamanho)

  const raio = tamanho * 0.12
  const cx = tamanho / 2
  const cy = tamanho / 2

  ctx.beginPath()
  ctx.arc(cx, cy, raio + 6, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(cx, cy, raio, 0, Math.PI * 2)
  ctx.fillStyle = corPrincipal
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${Math.round(raio)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(inicial, cx, cy + raio * 0.05)

  return canvas.toDataURL('image/png')
}

export function AbaMeuLink({ slug, nomeNegocio, logoUrl, corPrincipal, corSecundaria }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copiado, setCopiado] = useState(false)
  const url = linkPublico(slug)
  const fundo = corDeFundo(corPrincipal, corSecundaria)

  useEffect(() => {
    let cancelado = false
    gerarQrComBadge(url, corPrincipal, nomeNegocio.trim().charAt(0).toUpperCase() || 'O')
      .then((dataUrl) => {
        if (!cancelado) setQrDataUrl(dataUrl)
      })
      .catch(() => {
        if (!cancelado) setQrDataUrl('')
      })
    return () => {
      cancelado = true
    }
  }, [url, corPrincipal, nomeNegocio])

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // clipboard indisponível nesse navegador — sem fallback melhor aqui
    }
  }

  function baixarQrCode() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qrcode-${slug}.png`
    link.click()
  }

  return (
    <div className="space-y-3 text-center">
      <div className="h-2 w-full rounded-full" style={{ background: fundo }} />

      <div className="flex items-center gap-3 text-left">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto vem do Supabase Storage
          <img
            src={logoUrl}
            alt={nomeNegocio}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 flex-shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: fundo }}
          >
            {nomeNegocio.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{nomeNegocio}</p>
          <p className="text-xs text-slate-400 truncate">{url.replace(/^https?:\/\//, '')}</p>
        </div>
      </div>

      <div className="flex justify-center">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- data URL gerada no navegador, não é imagem de arquivo
          <img
            src={qrDataUrl}
            alt={`QR code do catálogo de ${nomeNegocio}`}
            className="w-40 h-40 rounded-xl border border-slate-200"
          />
        ) : (
          <div className="w-40 h-40 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
        )}
      </div>

      <div>
        <p className="text-sm text-slate-500 font-medium">Aponte a câmera pra testar</p>
        <p className="text-xs text-slate-400 mt-1">
          Imprima ou coloque na porta de casa, nas feiras, ou manda como imagem no WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={copiarLink}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
        >
          {copiado ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-500" />}
          {copiado ? 'Copiado!' : 'Copiar link'}
        </button>

        <CompartilharBotao
          url={url}
          titulo={nomeNegocio}
          texto={nomeNegocio}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold"
        >
          Compartilhar
        </CompartilharBotao>
      </div>

      <button
        type="button"
        onClick={baixarQrCode}
        disabled={!qrDataUrl}
        className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 mx-auto transition disabled:opacity-50"
      >
        <Download size={14} />
        Baixar QR code (imagem)
      </button>
    </div>
  )
}
