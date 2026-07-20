import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Veja o Olha Aí funcionando de verdade — teste ao vivo'

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
            fontSize: 24,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
            opacity: 0.85,
            marginBottom: 20,
          }}
        >
          100% interativo · sem criar conta
        </div>
        <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, lineHeight: 1.15, maxWidth: 980 }}>
          Veja o Olha Aí funcionando de verdade
        </div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 28, opacity: 0.92, maxWidth: 820 }}>
          Teste o cadastro, o painel e o catálogo do cliente ao vivo, com exemplos reais.
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
          olhaai.idsist.com.br/como-funciona
        </div>
      </div>
    ),
    { ...size }
  )
}
