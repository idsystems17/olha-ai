# Relatório de Segurança — Olha Aí (olha-ai-catalogo)
Data da revisão: 2026-07-20
Revisado por: IDsistemas

## Resumo
Varredura de saúde após a sessão de ajustes de hoje: preview de compartilhamento por loja, geração de slug independente do nome do negócio, troca "Cardápio" → "Vitrine", remoção da frase da landing, e reforma do painel (3 botões, modal de instalação, simulador interativo no lugar do tutorial estático). Não houve mudança em RLS, políticas de acesso, webhook ou headers de segurança — a base validada no relatório de 2026-07-17 continua de pé e não foi tocada hoje. Dois achados 🟡 surgiram do próprio processo de teste (não do código em si) e já foram corrigidos nesta rodada.

## Achados

### 🔴 Crítico
Nenhum.

### 🟠 Alto
Nenhum.

### 🟡 Médio — corrigidos nesta rodada
- ~~Senha temporária da conta de teste (`izis-5514` / `izisdiasduarte17@gmail.com`) ficou visível em texto puro na conversa~~ — corrigido: senha rotacionada para um valor aleatório que não foi exibido em lugar nenhum.
- ~~Token de sessão (magic link) da mesma conta de teste apareceu por completo na conversa durante um teste de login automatizado~~ — mitigado: o `access_token` expira em 1h e esse prazo já passou; a senha foi rotacionada, então mesmo que o `refresh_token` ainda esteja tecnicamente válido, ele não substitui a necessidade de senha para login normal. Nenhuma conta real de cliente foi afetada — é só a conta de teste, com dados fictícios ("Doces"/manjar).

### 🔵 Baixo / Boas práticas
- `script type="application/ld+json"` com `dangerouslySetInnerHTML` em `src/app/page.tsx` (adicionado em 19/07, fora do escopo de hoje, não coberto no relatório anterior). Verificado: o conteúdo (`JSON_LD`) é um objeto estático hardcoded, sem nenhum dado vindo de usuário ou do banco — é o padrão oficial recomendado pelo Next.js para dados estruturados de SEO. Sem risco de XSS real aqui, mas registrado porque é o único uso de `dangerouslySetInnerHTML` no projeto.
- `npm audit`: mesmas 2 vulnerabilidades moderadas em `postcss` (dependência interna do Next.js) já mapeadas e aceitas no relatório de 17/07 — nenhuma dependência nova foi instalada hoje, então nada mudou aqui.

## Correções aplicadas (antes / depois)

| Item | Arquivo/Ação | Antes | Depois | Testado em dev? |
|---|---|---|---|---|
| Senha exposta da conta de teste | Supabase Auth (usuário da loja `izis-5514`) | Senha `teste-temp-123456` visível na conversa | Senha rotacionada para valor aleatório de 24 bytes, não exibido; recomendado usar "Esqueci a senha" pra definir uma senha própria | Sim — script rodou sem erro, updateUserById confirmado |
| Slug/link não depender do nome do negócio | `src/app/api/auth/cadastro/route.ts` | Slug só ganhava sufixo numérico em caso de colisão | Slug sempre recebe sufixo aleatório de 4 dígitos, nunca é só o nome puro | Sim — cadastro testado no navegador, slug conferido |
| Preview de compartilhamento genérico | `src/app/[slug]/opengraph-image.tsx` (novo), `src/app/[slug]/page.tsx` | og:title/description/image herdavam o card genérico do site | Imagem e metadados específicos por loja (nome, foto, cor, bio) | Sim — `curl` confirmando og:tags corretos + imagem PNG 1200x630 renderizando |

## O que foi verificado e está OK
- Nenhum `.env` real commitado hoje nem no histórico; `.gitignore` continua correto.
- Nenhum segredo/chave hardcoded introduzido nos arquivos alterados hoje (`service_role`, tokens, senhas em literal) — varredura por regex não encontrou nada.
- Nenhum `console.log` vazando dado sensível nos arquivos alterados hoje.
- Os 3 scripts temporários usados pra testar (regenerar slug, gerar link de login, trocar senha) foram apagados logo após o uso — nenhum ficou no repositório.
- `opengraph-image.tsx` novo usa o client normal (`createClient()`, respeita RLS) e a view pública `tenants_publicos`, mesmo padrão já usado em `icon.tsx`/`apple-icon.tsx` — não usa `service_role`, não expõe WhatsApp/CPF/e-mail, só nome/foto/cor/bio (dados já públicos na página).
- `next.config.ts` (headers de segurança: CSP, X-Frame-Options, etc.) não foi tocado hoje — continua como validado em 17/07.
- Rota do webhook Kiwify não foi tocada hoje — validação de assinatura HMAC continua intacta.
- Nenhuma dependência nova instalada (`package.json`/`package-lock.json` sem alteração hoje).
- RLS e as políticas de acesso no Supabase não foram alteradas hoje — nenhuma migration nova, nenhum código de policy tocado.
- Componentes novos do painel (`ModalComoInstalar`, `ModalComoUsar`) só usam dados estáticos/fictícios ou uma imagem local — nenhuma chamada de API nova, nenhum dado sensível envolvido.

## Observação
Esta revisão segue um checklist estruturado de segurança aplicável a aplicações web modernas (Next.js/Vercel/Supabase). Nenhum sistema é 100% imune a falhas — esta análise reduz significativamente o risco mas não constitui garantia absoluta.
