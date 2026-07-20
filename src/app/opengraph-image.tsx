import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Olha Aí — catálogo digital pra quem vende pelo WhatsApp'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.18)',
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          O
        </div>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 920 }}>
          Sua vitrine bonita, no link do WhatsApp
        </div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 28, opacity: 0.92, maxWidth: 820 }}>
          Foto, preço e um botão que já abre o pedido pronto — sem taxa por venda.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 48,
            fontSize: 26,
            fontWeight: 700,
            background: 'rgba(255,255,255,0.16)',
            padding: '12px 24px',
            borderRadius: 9999,
            width: 'fit-content',
          }}
        >
          olhaai.idsist.com.br
        </div>
      </div>
    ),
    { ...size }
  )
}
