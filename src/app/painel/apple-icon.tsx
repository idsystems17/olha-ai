import { buscarTenantAutenticado } from '@/lib/tenant-autenticado'
import { gerarIconeInicial } from '@/lib/gerar-icone-tenant'

export const dynamic = 'force-dynamic'
export const size = { width: 180, height: 180 }

export default async function AppleIcon() {
  const tenant = await buscarTenantAutenticado()

  if (tenant?.logo_url) {
    return Response.redirect(tenant.logo_url)
  }

  return gerarIconeInicial(tenant, 180)
}
