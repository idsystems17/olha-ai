import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'
import { corDeFundo } from '@/lib/paleta'

export const dynamic = 'force-dynamic'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Catálogo no Olha Aí'

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tenant } = await supabase
    .from('tenants_publicos')
    .select('name, bio, logo_url, cor_principal, cor_secundaria')
    .eq('slug', slug)
    .maybeSingle()

  const nome = tenant?.name?.trim() || 'Olha Aí'
  const fundo = tenant ? corDeFundo(tenant.cor_principal, tenant.cor_secundaria) : 'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)'
  const inicial = nome.charAt(0).toUpperCase()

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
          background: fundo,
          color: '#ffffff',
        }}
      >
        {tenant?.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- dentro do ImageResponse (satori)
          <img
            src={tenant.logo_url}
            alt=""
            width={140}
            height={140}
            style={{ borderRadius: 9999, objectFit: 'cover', marginBottom: 48, border: '6px solid rgba(255,255,255,0.5)' }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 140,
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.18)',
              fontSize: 64,
              fontWeight: 700,
              marginBottom: 48,
            }}
          >
            {inicial}
          </div>
        )}
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>
          {nome}
        </div>
        {tenant?.bio && (
          <div style={{ display: 'flex', fontSize: 30, marginTop: 24, opacity: 0.92, maxWidth: 900 }}>
            {tenant.bio}
          </div>
        )}
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
