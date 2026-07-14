import { buscarTenantAutenticado } from '@/lib/tenant-autenticado'
import { gerarIconeInicial } from '@/lib/gerar-icone-tenant'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const tamanho = Number(new URL(request.url).searchParams.get('size')) || 512
  const tenant = await buscarTenantAutenticado()
  return gerarIconeInicial(tenant, tamanho)
}
