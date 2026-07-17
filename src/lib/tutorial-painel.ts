export type IconePasso = 'cardapio' | 'disponibilidade' | 'aparencia' | 'link' | 'compartilhar' | 'loja'

export type PassoTutorial = {
  numero: number
  titulo: string
  descricao: string
  icone: IconePasso
}

export const PASSOS_TUTORIAL_PAINEL: PassoTutorial[] = [
  {
    numero: 1,
    titulo: 'Monte seu cardápio',
    descricao: 'Na aba Cardápio, adicione foto, nome e preço de cada produto que você vende.',
    icone: 'cardapio',
  },
  {
    numero: 2,
    titulo: 'Diga o que tem hoje',
    descricao: 'Use o interruptor ao lado de cada item pra avisar o que está disponível agora.',
    icone: 'disponibilidade',
  },
  {
    numero: 3,
    titulo: 'Deixe com a sua cara',
    descricao: 'Na aba Aparência, escolha as cores e coloque a logo do seu negócio.',
    icone: 'aparencia',
  },
  {
    numero: 4,
    titulo: 'Pegue seu link e QR code',
    descricao: 'Na aba Meu link, copie o link do seu catálogo ou baixe o QR code.',
    icone: 'link',
  },
  {
    numero: 5,
    titulo: 'Compartilhe',
    descricao: 'Manda o link no WhatsApp e Instagram, ou imprime o QR code pra colocar na loja ou na feira.',
    icone: 'compartilhar',
  },
  {
    numero: 6,
    titulo: 'Abra e feche sua loja',
    descricao: 'Use o interruptor no topo do painel pra avisar quando você está atendendo.',
    icone: 'loja',
  },
]

export function chaveTutorialVisto(slug: string): string {
  return `olhaai:tutorial-visto:${slug}`
}
