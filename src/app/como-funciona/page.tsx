import type { Metadata } from 'next'
import { TutorialInterativo } from '@/components/landing/TutorialInterativo'

const TITULO = 'Como funciona o Olha Aí — teste ao vivo'
const DESCRICAO =
  'Simulador interativo do Olha Aí: veja o cadastro, o painel e o catálogo do cliente funcionando de verdade, com exemplos reais de quem já vende pelo WhatsApp.'

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: '/como-funciona' },
  openGraph: { title: TITULO, description: DESCRICAO, url: '/como-funciona' },
  twitter: { card: 'summary_large_image', title: TITULO, description: DESCRICAO },
}

export default function ComoFuncionaPage() {
  return <TutorialInterativo />
}
