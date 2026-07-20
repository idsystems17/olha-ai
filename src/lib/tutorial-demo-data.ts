// Dados fictícios usados só na landing page, pro simulador de celular
// interativo. Cores vêm da PALETA real (@/lib/paleta) pra que a aba
// "Aparência" da demonstração seja clicável de verdade, com os mesmos tons
// que a vendedora vai encontrar no painel de verdade.
import { PALETA } from './paleta'

export type ItemDemo = {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  isAvailableToday: boolean
}

export type PerfilDemo = {
  id: string
  title: string
  category: string
  name: string
  slug: string
  whatsapp: string
  bio: string
  logoUrl: string
  corPrincipal: string
  corSecundaria: string | null
  diasRestantes: number
  isSubscribed: boolean
  isOpen: boolean
  items: ItemDemo[]
}

const laranja = PALETA.find((c) => c.nome === 'Laranja')!.hex
const rosa = PALETA.find((c) => c.nome === 'Rosa')!.hex
const ambar = PALETA.find((c) => c.nome === 'Âmbar')!.hex
const azulPetroleo = PALETA.find((c) => c.nome === 'Azul-petróleo')!.hex
const indigo = PALETA.find((c) => c.nome === 'Índigo')!.hex

export const PERFIS_DEMO: PerfilDemo[] = [
  {
    id: 'cida-doces',
    title: 'Cida Doces Caseiros',
    category: 'Doces e bolos',
    name: 'Cida Doces Caseiros',
    slug: 'cida-doces',
    whatsapp: '11999998888',
    bio: 'Bolos vulcão fresquinhos e docinhos artesanais feitos todo dia com amor! 🍰✨',
    logoUrl: '/demo-tutorial/logo-cida.jpg',
    corPrincipal: rosa,
    corSecundaria: laranja,
    diasRestantes: 22,
    isSubscribed: false,
    isOpen: true,
    items: [
      {
        id: 'cida-1',
        name: 'Bolo Vulcão de Chocolate',
        price: 35,
        description: 'Bolo fofinho de chocolate com calda quente escorrendo que parece um vulcão!',
        imageUrl: '/demo-tutorial/item-bolo-vulcao.jpg',
        isAvailableToday: true,
      },
      {
        id: 'cida-2',
        name: 'Bolo de Cenoura com Brigadeiro',
        price: 28,
        description: 'O clássico bolo de cenoura com cobertura durinha e cremosa de brigadeiro puro.',
        imageUrl: '/demo-tutorial/item-bolo-cenoura.jpg',
        isAvailableToday: true,
      },
      {
        id: 'cida-3',
        name: 'Cento de Brigadeiros Gourmet',
        price: 85,
        description: 'Brigadeiros tradicionais enrolados no granulado belga. Ideal para sua festa.',
        imageUrl: '/demo-tutorial/item-brigadeiros.jpg',
        isAvailableToday: false,
      },
    ],
  },
  {
    id: 'fatima-salgados',
    title: 'Salgados da Fátima',
    category: 'Salgados e lanches',
    name: 'Salgados da Fátima',
    slug: 'fatima-salgados',
    whatsapp: '21988887777',
    bio: 'Salgadinhos fritos na hora, crocantes e super recheados. Ligue e encomende! 🥟🔥',
    logoUrl: '/demo-tutorial/logo-fatima.jpg',
    corPrincipal: ambar,
    corSecundaria: null,
    diasRestantes: 14,
    isSubscribed: false,
    isOpen: true,
    items: [
      {
        id: 'fatima-1',
        name: 'Cento de Coxinha de Frango',
        price: 70,
        description: 'Coxinhas douradinhas com massa de batata e recheio de frango desfiado temperado.',
        imageUrl: '/demo-tutorial/item-coxinha.jpg',
        isAvailableToday: true,
      },
      {
        id: 'fatima-2',
        name: 'Pastel de Feira Especial',
        price: 8,
        description: 'Pastel de vento frito na hora com recheio caprichado de carne com queijo.',
        imageUrl: '/demo-tutorial/item-pastel.jpg',
        isAvailableToday: true,
      },
      {
        id: 'fatima-3',
        name: 'Empada de Palmito (Grande)',
        price: 7.5,
        description: 'Massa podre que derrete na boca com recheio cremoso de palmito e azeitona.',
        imageUrl: '/demo-tutorial/item-empada.jpg',
        isAvailableToday: false,
      },
    ],
  },
  {
    id: 'cleiton-estofados',
    title: 'Cleiton Estofados',
    category: 'Serviços gerais',
    name: 'Cleiton Higienização',
    slug: 'cleiton-estofados',
    whatsapp: '31977776666',
    bio: 'Limpeza e impermeabilização profissional de estofados. Sofá novo de novo! 🛋️✨',
    logoUrl: '/demo-tutorial/logo-cleiton.jpg',
    corPrincipal: azulPetroleo,
    corSecundaria: indigo,
    diasRestantes: 29,
    isSubscribed: true,
    isOpen: true,
    items: [
      {
        id: 'cleiton-1',
        name: 'Higienização de Sofá (até 3 lugares)',
        price: 180,
        description: 'Limpeza profunda com máquina extratora para remoção de sujeiras, manchas e ácaros.',
        imageUrl: '/demo-tutorial/item-sofa.jpg',
        isAvailableToday: true,
      },
      {
        id: 'cleiton-2',
        name: 'Limpeza de Colchão Casal',
        price: 150,
        description: 'Lavagem a seco bactericida e antialérgica para colchões de casal comum ou box.',
        imageUrl: '/demo-tutorial/item-colchao.jpg',
        isAvailableToday: true,
      },
    ],
  },
]
