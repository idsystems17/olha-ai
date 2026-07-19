export type PassoTutorial = {
  numero: number
  titulo: string
  descricao: string
  imagem: string
  // Posição (% da largura/altura da imagem) do detalhe mencionado no passo,
  // pra desenhar uma seta apontando pro lugar certo. Sem alvo = sem seta.
  alvo?: { x: number; y: number }
}

export const PASSOS_TUTORIAL_PAINEL: PassoTutorial[] = [
  {
    numero: 1,
    titulo: 'Monte seu cardápio',
    descricao: 'Na aba Cardápio, adicione foto, nome e preço de cada produto que você vende.',
    imagem: '/tutorial/cardapio.jpg',
    alvo: { x: 50, y: 21.2 },
  },
  {
    numero: 2,
    titulo: 'Diga o que tem hoje',
    descricao: 'Use o interruptor ao lado de cada item pra avisar o que está disponível agora.',
    imagem: '/tutorial/cardapio-item.jpg',
    alvo: { x: 60.4, y: 26.9 },
  },
  {
    numero: 3,
    titulo: 'Deixe com a sua cara',
    descricao: 'Na aba Aparência, escolha as cores e coloque a logo do seu negócio.',
    imagem: '/tutorial/aparencia.jpg',
    alvo: { x: 32.1, y: 47.5 },
  },
  {
    numero: 4,
    titulo: 'Pegue seu link e QR code',
    descricao: 'Na aba Meu link, copie o link do seu catálogo ou baixe o QR code.',
    imagem: '/tutorial/meu-link.jpg',
    alvo: { x: 50, y: 25.7 },
  },
  {
    numero: 5,
    titulo: 'Compartilhe',
    descricao: 'Manda o link no WhatsApp e Instagram, ou imprime o QR code pra colocar na loja ou na feira.',
    imagem: '/tutorial/meu-link.jpg',
    alvo: { x: 63.1, y: 40.7 },
  },
  {
    numero: 6,
    titulo: 'Abra e feche sua loja',
    descricao: 'Use o interruptor no topo do painel pra avisar quando você está atendendo.',
    imagem: '/tutorial/cardapio.jpg',
    alvo: { x: 71, y: 17.6 },
  },
]

export function chaveTutorialVisto(slug: string): string {
  return `olhaai:tutorial-visto:${slug}`
}
