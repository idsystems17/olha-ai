import { createHmac } from 'crypto'

export function normalizarCpf(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

// HMAC em vez de hash puro: sem o pepper (só no env, nunca no banco), não dá
// pra montar uma rainbow table e "adivinhar" o CPF original a partir do hash,
// mesmo o CPF tendo pouca entropia (só 11 dígitos).
export function hashCpf(cpfNormalizado: string): string {
  const pepper = process.env.CPF_HASH_PEPPER
  if (!pepper) throw new Error('CPF_HASH_PEPPER não configurado.')
  return createHmac('sha256', pepper).update(cpfNormalizado).digest('hex')
}
