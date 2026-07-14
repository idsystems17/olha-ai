import { gerarIconeInicial } from '@/lib/gerar-icone-tenant'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return gerarIconeInicial({ name: 'Olha Aí', cor_principal: '#f97316', cor_secundaria: null }, 32)
}
