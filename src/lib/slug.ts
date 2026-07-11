// Rotas do próprio app — um tenant nunca pode ficar com esses slugs,
// senão a página estática do app "esconde" o catálogo dele nessa URL
export const SLUGS_RESERVADOS = new Set([
  'login', 'cadastro', 'esqueci-senha', 'redefinir-senha',
  'painel', 'api', 'auth', 'meu-link', 'criar-catalogo',
  'termos-de-uso', 'politica-de-privacidade', 'favicon.ico',
  '_next', 'olhaai', 'olha-ai', 'admin',
])

export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos (marcas diacríticas combinantes)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'catalogo'
}
