// Número sempre guardado como DDD + número (10 ou 11 dígitos), sem o código do país.
// O "55" só entra na hora de montar o link do wa.me — nunca no armazenamento —
// porque DDD 55 (região de Santa Maria/RS) existe de verdade e colidiria com o DDI.
export function normalizarWhatsapp(valor: string): string {
  let digitos = valor.replace(/\D/g, '')
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) {
    digitos = digitos.slice(2)
  }
  return digitos.slice(0, 11)
}

export function whatsappValido(digitos: string): boolean {
  return digitos.length === 10 || digitos.length === 11
}

export function linkWhatsapp(whatsapp: string, mensagem: string): string {
  return `https://wa.me/55${whatsapp}?text=${encodeURIComponent(mensagem)}`
}

// Formata pra exibição/digitação: "(28) 99938-7161". Funciona tanto com o
// número parcial (enquanto a pessoa digita) quanto com o número completo.
export function formatarWhatsappVisual(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11)
  if (digitos.length <= 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '')
  }
  return digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '')
}
