# Relatório de Segurança — Olha Aí (olha-ai-catalogo)
Data da revisão: 2026-07-27
Revisado por: IDsistemas

## Resumo
Varredura focada nas mudanças de hoje (commits `f6bcd80`, `2e58ae7`, `9dd1f04`): cache de 60s na vitrine pública com revalidação sob demanda, teto técnico de 1.000 itens por loja, lazy loading de fotos, regra de rate limiting no Vercel Firewall (config, sem código) e um índice novo no banco. Nada em RLS, autenticação, headers ou webhook foi tocado hoje — a base validada em 17/07 e 20/07 continua de pé. Nenhuma vulnerabilidade crítica, alta ou média encontrada.

## Achados

### 🔴 Crítico
Nenhum.

### 🟠 Alto
Nenhum.

### 🟡 Médio
Nenhum.

### 🔵 Baixo / Boas práticas
Nenhum achado novo. Ponto observado e considerado aceitável (não é uma falha, é uma característica esperada de qualquer cache com TTL): com `revalidate = 60`, existe uma janela de até 60s onde a vitrine pode servir uma versão levemente desatualizada da página caso o cron de expiração de trial apague uma loja nesse intervalo — mas o `revalidatePath` cobre 100% das edições feitas pela própria vendedora (aparência, itens, abrir/fechar loja), e a janela de 60s do cron não expõe nenhum dado que não estivesse público segundos antes.

## Correções aplicadas (antes / depois)
Nenhuma correção necessária nesta rodada.

## O que foi verificado e está OK
- **`revalidatePath` nas 4 rotas de mutação (`aparencia`, `loja`, `items`, `items/[id]`)**: o `slug` usado vem sempre da própria linha do tenant autenticado (`.eq('user_id', user.id)`), nunca de input do usuário — sem brecha de um lojista disparar revalidação no caminho de outro. `revalidatePath` só invalida cache no servidor, não retorna nem vaza nenhum dado pro cliente.
- **Cache por slug (`revalidate = 60`) em `page.tsx`, `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`, `manifest/[slug]/route.ts` e `icon/route.tsx`**: o Next.js mantém uma entrada de cache por valor de `slug` (rota dinâmica), não uma entrada global compartilhada — cache da loja A nunca pode vazar pra requisição da loja B.
- **Contagem de itens antes do insert (`api/items` POST)**: consulta escopada por `tenant_id` do próprio usuário autenticado (mesmo padrão de isolamento já usado em todo o resto da API); sem risco de um lojista contar ou ser afetado pelos itens de outro. Existe uma corrida teórica (duas requisições simultâneas passando a checagem ao mesmo tempo perto do limite de 1.000), mas o pior cenário é passar o teto técnico em uma dezena de itens — sem qualquer impacto de segurança, só uma folga a mais num disjuntor que já é generoso.
- **`.limit()` nas 3 consultas de listagem**: só limita quantidade de linhas retornadas, sem alterar filtro/autorização — mesma cláusula `.eq('tenant_id', ...)` de antes continua garantindo isolamento entre lojas.
- **Regra de rate limiting no Vercel Firewall** (`Rate limit cadastro`): confirmado via `vercel firewall rules inspect` — path exato `/api/auth/cadastro`, método `POST`, chave por IP, sem afetar nenhuma outra rota. Hoje em modo `log` (observação), ainda não bloqueando — não é uma falha, é o estágio planejado antes de ativar o bloqueio de verdade (checkpoint agendado pra 30/07).
- **Migration `0006_indice_trial_expirado.sql`**: só adiciona um índice, não altera nenhuma policy de RLS nem grant de tabela. Aplicada manualmente no projeto certo (`olha-ai`, confirmado por captura de tela do SQL Editor), com sucesso.
- **`loading="lazy"` nas fotos**: atributo puramente de performance do navegador, sem nenhuma implicação de segurança.
- Nenhum segredo, chave ou token novo introduzido em nenhum dos arquivos alterados hoje.
- Nenhuma dependência nova instalada (`package.json`/`package-lock.json` sem alteração).
- Nenhuma mensagem de erro nova expõe detalhe técnico ao usuário final — os `NextResponse.json({ error: ... })` adicionados hoje seguem o mesmo padrão de mensagem amigável já usado no resto do projeto.

## Observação
Esta revisão segue um checklist estruturado de segurança aplicável a aplicações web modernas (Next.js/Vercel/Supabase). Nenhum sistema é 100% imune a falhas — esta análise reduz significativamente o risco mas não constitui garantia absoluta.
