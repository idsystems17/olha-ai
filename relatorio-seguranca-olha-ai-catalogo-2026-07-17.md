# Relatório de Segurança — Olha Aí (olha-ai-catalogo)
Data da revisão: 2026-07-17
Revisado por: IDsistemas

## Resumo
Revisão de fim-de-ciclo após as correções de WhatsApp/DDI, edição de conta e configuração de SMTP (Resend). Rodado primeiro o `/security-review` automatizado sobre o diff do dia (nenhum achado com confiança ≥8/10 sobreviveu à filtragem), depois o checklist estruturado universal + stack Next.js/Supabase/Vercel. Nenhum item 🔴 crítico ou 🟠 alto encontrado. A base de segurança do projeto (RLS, validação de webhook, proteção contra enumeração de usuário) já estava sólida e segue o protocolo documentado em `SEGURANCA.md`. Os 5 achados 🟡 médios foram corrigidos e testados no mesmo dia (ver tabela de correções) — nenhum ficou pendente. Um quinto item apareceu durante a conversa com a usuária (exclusão de conta não considerava assinatura ativa na Kiwify) e foi corrigido na mesma rodada.

## Achados

### 🔴 Crítico
Nenhum.

### 🟠 Alto
Nenhum.

### 🟡 Médio — todos corrigidos e testados no mesmo dia (ver tabela abaixo)
- ~~Nenhum cabeçalho de segurança configurado~~ — corrigido.
- ~~Sem página de Política de Privacidade / Termos de Uso~~ — corrigido.
- ~~Sem fluxo de autoatendimento para exclusão de conta/dados~~ — corrigido.
- ~~Upload de foto validava só o header `Content-Type`~~ — corrigido.
- ~~Exclusão de conta não considerava assinatura Kiwify ativa~~ — corrigido (achado durante revisão com a usuária, fora do checklist original).

### 🔵 Baixo / Boas práticas
- `npm audit` aponta 2 vulnerabilidades moderadas em `postcss`, mas é uma dependência **interna** do próprio Next.js (`node_modules/next/node_modules/postcss`), não uma dependência direta do projeto. A única correção automática (`npm audit fix --force`) rebaixaria o Next.js pra versão 9 — inaceitável. É uma ferramenta de build/CSS, não processa conteúdo vindo de usuário neste app, então o risco real de exploração aqui é muito baixo. Não há ação segura a tomar agora além de aguardar uma atualização oficial do Next.js que resolva a dependência interna.
- Backup automático do Supabase: ainda não configurado (plano Free não tem). Já mapeado — resolve com a migração pro Supabase Pro já planejada.

## Correções aplicadas (antes / depois)

| Item | Arquivo/Regra alterada | Antes | Depois | Testado em dev? |
|---|---|---|---|---|
| Cabeçalhos de segurança | `next.config.ts` | Nenhum header customizado | `headers()` com CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (CSP com `script-src`/`style-src` incluindo `'unsafe-inline'` — Next.js App Router injeta script inline de hidratação sem nonce; fechar isso por completo exigiria nonce por request no `proxy.ts`, deixado como próximo passo se quiser CSP ainda mais restrito) | Sim — `curl -sI` confirmando os 5 headers presentes na resposta real |
| Política de Privacidade / Termos de Uso | `src/app/politica-de-privacidade/page.tsx`, `src/app/termos-de-uso/page.tsx` (novos), `src/app/(auth)/cadastro/page.tsx` | Slugs reservados, páginas inexistentes | Páginas criadas com conteúdo real (o que é coletado, por quê, direitos LGPD, contato) e linkadas no rodapé do formulário de cadastro | Sim — build estático das duas páginas ok, conteúdo confirmado via `curl` |
| Exclusão de conta self-service | `src/app/api/conta/route.ts` (novo `DELETE`), `src/components/painel/AbaConta.tsx` | Só "Sair da conta" (logout) | Botão "Excluir minha conta" no painel, exige reconfirmar a senha; rota server-side reverifica a senha antes de excluir (`admin.auth.admin.deleteUser`, cascateia tenant + itens) | Sim — testado com conta real: sem senha → 400, senha errada → 401, sem sessão → 401, senha certa → excluiu e catálogo sumiu (404) |
| Magic bytes no upload de foto | `src/app/api/upload-foto/route.ts` | Só checava `file.type` (header, forjável) | Confere os primeiros bytes do arquivo (JPEG/PNG/GIF/WebP) antes de aceitar, além do header | Sim — testado com arquivo de texto disfarçado de `.jpg` (rejeitado, 400) e PNG real (aceito, 200) |
| Exclusão de conta com assinatura Kiwify ativa | `src/app/api/conta/route.ts` (`DELETE`), `src/components/painel/AbaConta.tsx`, `src/components/painel/PainelClient.tsx` | A exclusão de conta apagava tudo mesmo com assinatura Kiwify ativa — a cobrança continuaria rodando sem ninguém saber (a Kiwify não tem endpoint de API pra cancelar assinatura, confirmado na documentação oficial). | Se `is_subscribed = true`, o botão de excluir manda a pessoa pra `dashboard.kiwify.com.br/minhas-compras` cancelar lá antes, em vez de abrir o formulário de senha. Reforçado também no servidor (não só na tela): a rota `DELETE /api/conta` recusa com 409 se a assinatura ainda estiver ativa, mesmo com senha correta. | Sim — testado com conta assinante de verdade: senha certa + assinatura ativa → bloqueado (409); mesma conta sem assinatura → excluiu normalmente (200) e catálogo sumiu (404) |

Bônus verificado nessa investigação (não precisou de código novo): o caminho **contrário** — cliente cancela a assinatura direto na Kiwify — já funciona automaticamente hoje. Testado simulando um webhook `subscription_canceled` real e assinado contra um tenant assinante: o catálogo público saiu do ar (200 → 404) na mesma hora, sem nenhuma mudança de código. Esse mecanismo já existia (view `tenants_publicos` com `is_active = is_subscribed or dentro do trial`) e continua funcionando certo.

Todos os cinco achados 🟡 foram corrigidos, testados em dev com requisições reais contra o servidor rodando (não só leitura de código), e as contas de teste usadas foram apagadas depois.

## O que foi verificado e está OK
- RLS habilitado em **todas** as tabelas (`tenants`, `items`, `cpf_usados`, `kiwify_eventos_processados`), com policies escopadas por dono (`user_id = auth.uid()`); as duas tabelas sensíveis não têm nenhuma policy pra `anon`/`authenticated` — só `service_role` acessa, documentado explicitamente no SQL.
- `service_role key` nunca aparece em componente client nem em nada que vá pro bundle do navegador — só usada via `createAdminClient()` em rotas server-side.
- Nenhum `.env` real foi commitado, nem hoje nem no histórico do git; `.gitignore` correto.
- Nenhuma chave/segredo hardcoded no código-fonte; nenhum `console.log` vazando senha/token/segredo.
- Variáveis `NEXT_PUBLIC_*` são todas realmente públicas (URL, anon key, link de checkout, e-mail de suporte) — há inclusive um comentário no `.env.example` avisando pra nunca prefixar a `service_role key`.
- Webhook da Kiwify valida assinatura HMAC-SHA1 com comparação em tempo constante (`timingSafeEqual`), falha fechado (401 se assinatura inválida) e é idempotente (reenvio do mesmo evento não duplica efeito).
- Fluxo de "esqueci senha" usa mensagem genérica, não revela se o e-mail existe (proteção deliberada contra enumeração de usuário, com comentário confirmando a intenção no código).
- Rate limiting de autenticação delegado ao Supabase Auth (provedor maduro) — confirmado hoje mesmo em uso real ao configurar o SMTP.
- Upload de foto: exige autenticação, confere dono do tenant, limite de 3MB, nome de arquivo via UUID (sem path traversal).
- Nenhum `dangerouslySetInnerHTML` em todo o código-fonte — sem vetor de XSS via innerHTML.
- CORS sem wildcard/configuração permissiva — same-origin padrão do Next.js.
- HTTPS garantido pela Vercel em todos os domínios automaticamente.
- O endpoint `/api/conta` (criado hoje) segue o mesmo padrão seguro já usado em `/api/aparencia`: autenticação obrigatória, escopo por `user_id`, sem mass assignment.
- `/security-review` automatizado não encontrou vulnerabilidade de alta confiança (≥8/10) no código alterado hoje — o único candidato (falta de reautenticação antes de trocar e-mail) foi investigado e rejeitado como falso positivo, já que o Supabase já exige confirmação por link antes da troca ter efeito.

## Observação
Esta revisão segue um checklist estruturado de segurança aplicável a aplicações web modernas (Next.js/Vercel/Supabase). Nenhum sistema é 100% imune a falhas — esta análise reduz significativamente o risco mas não constitui garantia absoluta.
