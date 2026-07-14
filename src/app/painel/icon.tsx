import { buscarTenantAutenticado } from '@/lib/tenant-autenticado'
import { gerarIconeTenant } from '@/lib/gerar-icone-tenant'

export const dynamic = 'force-dynamic'
export const size = { width: 32, height: 32 }

export default async function Icon() {
  const tenant = await buscarTenantAutenticado()
  return gerarIconeTenant(tenant, 32)
}
