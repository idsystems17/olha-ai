// Paleta fechada de cores soltas — a vendedora escolhe uma cor principal e,
// opcionalmente, uma secundária (fica gradiente); sem cor secundária, fica sólida.
// Continua sem builder livre: as cores em si vêm sempre dessa lista fixa.
export const PALETA = [
  { nome: 'Carvão', hex: '#1e293b' },
  { nome: 'Verde', hex: '#16a34a' },
  { nome: 'Esmeralda', hex: '#059669' },
  { nome: 'Verde-azulado', hex: '#0d9488' },
  { nome: 'Azul-petróleo', hex: '#0e7490' },
  { nome: 'Azul', hex: '#2563eb' },
  { nome: 'Índigo', hex: '#4f46e5' },
  { nome: 'Roxo', hex: '#7c3aed' },
  { nome: 'Púrpura', hex: '#9333ea' },
  { nome: 'Magenta', hex: '#c026d3' },
  { nome: 'Rosa', hex: '#db2777' },
  { nome: 'Vermelho', hex: '#dc2626' },
  { nome: 'Laranja', hex: '#ea580c' },
  { nome: 'Âmbar', hex: '#d97706' },
] as const

const HEX_VALIDO = /^#[0-9a-fA-F]{6}$/

export function corDeFundo(corPrincipal: string, corSecundaria: string | null): string {
  const principal = HEX_VALIDO.test(corPrincipal) ? corPrincipal : PALETA[0].hex
  if (corSecundaria && HEX_VALIDO.test(corSecundaria)) {
    return `linear-gradient(135deg, ${principal}, ${corSecundaria})`
  }
  return principal
}
