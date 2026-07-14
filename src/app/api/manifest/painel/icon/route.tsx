import { buscarTenantAutenticado } from '@/lib/tenant-autenticado'
import { gerarIconeTenant } from '@/lib/gerar-icone-tenant'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const tamanho = Number(new URL(request.url).searchParams.get('size')) || 512
  const tenant = await buscarTenantAutenticado()
  return gerarIconeTenant(tenant, tamanho)
}
