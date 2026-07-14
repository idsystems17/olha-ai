import { buscarTenantAutenticado } from '@/lib/tenant-autenticado'
import { gerarIconeTenant } from '@/lib/gerar-icone-tenant'

export const dynamic = 'force-dynamic'
export const size = { width: 180, height: 180 }

export default async function AppleIcon() {
  const tenant = await buscarTenantAutenticado()
  return gerarIconeTenant(tenant, 180)
}
