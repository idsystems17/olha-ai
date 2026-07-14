import { gerarIconeTenant } from '@/lib/gerar-icone-tenant'

export async function GET(request: Request) {
  const tamanho = Number(new URL(request.url).searchParams.get('size')) || 512
  return gerarIconeTenant({ name: 'Olha Aí', cor_principal: '#f97316', cor_secundaria: null }, tamanho)
}
