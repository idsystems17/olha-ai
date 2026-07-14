import { ImageResponse } from 'next/og'
import { corDeFundo } from '@/lib/paleta'

export type TenantParaIcone = {
  name: string
  cor_principal: string
  cor_secundaria: string | null
} | null

export function gerarIconeInicial(tenant: TenantParaIcone, tamanho: number) {
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
    { width: tamanho, height: tamanho }
  )
}
