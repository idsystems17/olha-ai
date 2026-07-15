import { createHash } from 'crypto'

// Gera um valor curto que muda sempre que a aparência do tenant muda —
// usado como query param nos ícones do manifest pra "furar" o cache de 24h
// do navegador/celular assim que ela troca cor ou foto (ver
// src/lib/gerar-icone-tenant.tsx).
export function versaoAparencia(partes: (string | null | undefined)[]): string {
  return createHash('sha1').update(partes.join('|')).digest('hex').slice(0, 8)
}
