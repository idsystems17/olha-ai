import { ImageResponse } from 'next/og'
import { corDeFundo } from '@/lib/paleta'

export type TenantParaIcone = {
  name: string
  logo_url?: string | null
  cor_principal: string
  cor_secundaria: string | null
} | null

// Cacheável por um tempo: o Windows/Edge precisa buscar o ícone rápido durante
// a instalação do PWA, senão cai no ícone genérico do sistema. Nome/foto/cor
// mudam raramente, então cache de 1 dia é seguro.
const CACHE_ICONE = { 'Cache-Control': 'public, max-age=86400' }

// Sempre gera um PNG quadrado no tamanho exato pedido — nunca aponta direto
// pra foto original (tamanho/proporção arbitrários), porque o Windows exige
// tamanhos numéricos declarados batendo com o arquivo real, senão ignora o
// ícone e mostra um genérico (ver node_modules/next não documenta isso; vem
// da doc do Edge: learn.microsoft.com/microsoft-edge/progressive-web-apps).
export function gerarIconeTenant(tenant: TenantParaIcone, tamanho: number) {
  if (tenant?.logo_url) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- dentro do ImageResponse (satori), não é JSX de página normal */}
          <img
            src={tenant.logo_url}
            width={tamanho}
            height={tamanho}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ),
      { width: tamanho, height: tamanho, headers: CACHE_ICONE }
    )
  }

  const inicial = (tenant?.name.trim() || 'Olha Aí').charAt(0).toUpperCase()
  const fundo = tenant ? corDeFundo(tenant.cor_principal, tenant.cor_secundaria) : '#f97316'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: fundo,
          color: '#ffffff',
          fontSize: Math.round(tamanho * 0.55),
          fontWeight: 700,
        }}
      >
        {inicial}
      </div>
    ),
    { width: tamanho, height: tamanho, headers: CACHE_ICONE }
  )
}
