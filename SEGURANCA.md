# Protocolo de Segurança — Regras Operacionais para Geração de Código

A partir de agora, todo código gerado neste projeto segue rigorosamente as regras abaixo, sem exceção, independente de stack, linguagem ou tipo de sistema. Adapte cada proteção ao contexto tecnológico revelado na conversa. Aplique tudo silenciosamente — não é necessário citar este documento a cada resposta, apenas siga as regras. Se eu perguntar "por que fez assim?", explique a motivação.

=============================================
PRINCÍPIOS FUNDAMENTAIS
=============================================

1. DEFESA EM PROFUNDIDADE: cada camada do sistema deve ser independentemente segura. Se o frontend valida, o backend TAMBÉM valida. Se o banco tem constraints, o código TAMBÉM verifica.
2. NUNCA CONFIE NO FRONTEND: toda entrada vinda do cliente é potencialmente maliciosa. Validação e autorização sempre no servidor.
3. MENOR PRIVILÉGIO: cada componente, usuário, serviço, query e função tem apenas as permissões mínimas necessárias.
4. FALHE DE FORMA SEGURA (fail closed): erro ou exceção não tratada resulta em negação de acesso, nunca em concessão.
5. SEGREDOS FORA DO CÓDIGO — SEMPRE: nunca API keys, tokens, senhas, connection strings ou secrets no código-fonte, comentários, logs, mensagens de erro. Use variáveis de ambiente ou gerenciador de secrets. Se eu pedir diferente, recuse e explique o risco.
6. SEGURANÇA POR DESIGN, NÃO POR OBSCURIDADE: o sistema deve permanecer seguro mesmo com repositório público. Os únicos segredos são variáveis de ambiente.

=============================================
A01 — BROKEN ACCESS CONTROL
=============================================
- Controle de acesso sempre no servidor. Negar por padrão.
- Em toda leitura/edição/exclusão: verificar se o usuário autenticado é dono ou tem permissão sobre aquele recurso específico.
- Proteger contra IDOR, escalação de privilégio vertical e horizontal.
- CORS restritivo — nunca wildcard (*) em produção com credenciais.
- Invalidar tokens/sessões no servidor no logout.
- Proteger contra SSRF: validar e filtrar URLs fornecidas pelo usuário antes de requisição server-side.
- Validar permissões em cada endpoint, não só nas rotas do frontend.
- **Multi-tenant**: se o projeto isola dados por cliente/organização (`client_id`, `tenant_id` ou equivalente), toda query deve filtrar por esse campo — nunca confiar apenas em RLS ou em filtro de frontend para isso.

=============================================
A02 — SECURITY MISCONFIGURATION
=============================================
- Remover funcionalidades, páginas e endpoints não utilizados.
- Nunca expor stack trace, erro detalhado, nome de tabela ou informação de debug em produção.
- Headers de segurança obrigatórios: CSP restritivo, X-Content-Type-Options: nosniff, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy.
- Nunca credenciais ou configuração padrão em nenhum ambiente.
- **Se usar Supabase**: configurar RLS em TODAS as tabelas sem exceção, e nunca usar a `service_role key` fora de ambiente de servidor isolado — jamais embutida em código que possa parar no bundle do frontend. Isso ignora RLS por completo e é o erro mais recorrente do ecossistema.
- Ambientes de desenvolvimento/staging não devem ser acessíveis publicamente.

=============================================
A03 — SOFTWARE SUPPLY CHAIN FAILURES
=============================================
- Usar lockfiles e commitá-los.
- Preferir dependências com grande base de usuários, manutenção ativa e boa reputação. Nunca importar biblioteca obscura, abandonada ou sem verificação.
- **Antes de instalar qualquer pacote sugerido por IA (inclusive por você mesmo): confirmar que o pacote existe de fato no repositório oficial (npm, PyPI, etc.) antes de rodar o install.** Modelos de IA ocasionalmente sugerem nomes de pacote plausíveis mas inexistentes ("slopsquatting") — um atacante pode registrar esse nome exato com código malicioso, esperando alguém instalar por confiança automática.
- Não executar script de pós-instalação sem revisar.

=============================================
A04 — CRYPTOGRAPHIC FAILURES
=============================================
- Senhas: Argon2id, bcrypt ou scrypt. Nunca MD5, SHA-1 ou SHA-256 simples.
- HTTPS/TLS obrigatório, desabilitar TLS 1.0/1.1.
- Dados sensíveis em repouso: AES-256-GCM ou equivalente.
- Nunca criar algoritmo criptográfico próprio.
- Tokens e IDs de sessão: gerar com CSPRNG. Comparar em tempo constante.
- Nunca logar senha, token, chave, dado de cartão ou dado pessoal sensível.

=============================================
A05 — INJECTION
=============================================
- SQL: sempre query parametrizada/prepared statement, nunca concatenação.
- XSS: sanitizar toda entrada, encoding de saída por contexto, CSP como camada adicional, nunca `innerHTML`/`dangerouslySetInnerHTML`/equivalentes com dado de usuário sem sanitização.
- Command Injection: nunca executar comando de sistema com input do usuário sem allowlist estrita.
- NoSQL e Template Injection: validar e tipificar antes de interpretar.

=============================================
A06 — INSECURE DESIGN
=============================================
- Toda regra de negócio que envolve dinheiro, permissão ou acesso a conteúdo tem validação server-side explícita — nunca depender do frontend esconder um botão.
- Pensar em cenário de abuso em cada feature: "o que acontece se alguém mal-intencionado tentar explorar isso?"

=============================================
A07 — IDENTIFICATION AND AUTHENTICATION FAILURES
=============================================
- Preferir provedor de autenticação maduro (Supabase Auth, Auth0, Clerk, NextAuth) em vez de implementar do zero.
- Rate limiting em login com lockout progressivo.
- Mensagem de erro genérica: nunca diferenciar "e-mail não encontrado" de "senha incorreta".
- Access token com expiração curta, refresh token com rotação, validar assinatura/expiração/audience/issuer em toda requisição.
- MFA quando viável.

=============================================
A08 — SOFTWARE AND DATA INTEGRITY FAILURES
=============================================
- Nunca desserializar dado de fonte não confiável sem validação rigorosa.
- Subresource Integrity (SRI) para script de CDN.
- Proteger pipeline CI/CD contra modificação não autorizada.
- **Webhooks de pagamento — qualquer origem**: seja plataforma pronta (Kiwify, Hotmart, Monetizze, Eduzz, Cacto e outras) ou gateway integrado diretamente (Mercado Pago, Stripe, Asaas, PagSeguro), NUNCA confiar cegamente no payload recebido. Validar sempre: assinatura HMAC, timestamp (contra replay), comparação em tempo constante, e idempotência (mesmo evento processado 2x não duplica o efeito). Gateway próprio exige atenção redobrada — não existe rede de segurança de plataforma terceira cobrindo esse ponto.
- **Conectores/MCP**: se o projeto usa servidores MCP (Model Context Protocol) para conectar a ferramentas externas, tratar cada um como superfície de ataque — instalar apenas de fonte confiável e verificada, nunca por nome parecido a um popular sem checar a origem, e nunca dar a um agente de IA permissão maior do que a tarefa exige.

=============================================
A09 — SECURITY LOGGING AND ALERTING FAILURES
=============================================
- Logar evento de segurança relevante (login, logout, falha de autenticação, acesso negado, criação/edição/exclusão de recurso sensível, mudança de permissão, operação financeira) em formato estruturado (JSON): timestamp, IP, userId, action, resource, result, userAgent.
- Nunca logar senha, token, dado de cartão, ou dado pessoal sensível (CPF, dado de saúde etc.).

=============================================
A10 — MISHANDLING OF EXCEPTIONAL CONDITIONS
=============================================
- Capturar e tratar toda exceção. Nunca expor detalhe interno em resposta de erro.
- Qualquer exceção não tratada resulta em negação de acesso (fail closed).

=============================================
RACE CONDITIONS — PROTEÇÃO OBRIGATÓRIA
=============================================
- Transação atômica no banco para toda operação "verificar-e-agir". Para financeiro/estoque: lock de linha (`SELECT FOR UPDATE` ou equivalente).
- Incremento/decremento: operação atômica no banco, nunca ler-calcular-gravar em passos separados.
- Unique constraint como camada adicional (ex: `unique(user_id, coupon_id)`).
- Idempotency keys em operação crítica.
- Cenários que exigem essa proteção: compra, pagamento, cupom, reembolso, curtida/toggle, criação de recurso único, upgrade/downgrade de plano, link de convite de uso único.

=============================================
VALIDAÇÃO DE INPUT — TODOS OS CAMPOS, TODOS OS ENDPOINTS
=============================================
- Tamanho máximo em todo campo de texto e no body inteiro da requisição.
- Validação de tipo (número, e-mail, data, UUID) e de formato com schema tipado quando a stack permitir.
- Paginação: limitar `page_size` máximo.
- Upload de arquivo: validar MIME type no header E nos magic bytes, limitar tamanho, allowlist de tipo, renomear com UUID, armazenar fora do webroot, nunca executar/interpretar arquivo do usuário.
- URL fornecida por usuário: validar protocolo (https), domínio contra allowlist quando possível, limitar tamanho.

=============================================
PROTEÇÃO CONTRA ENUMERAÇÃO DE USUÁRIOS
=============================================
- Login, cadastro e recuperação de senha: mensagem genérica que não confirma se o e-mail existe.
- Tempo de resposta consistente nessas rotas. Rate limiting agressivo.

=============================================
PROTEÇÃO DE DADOS E PRIVACIDADE (LGPD)
=============================================
- Coletar apenas o dado estritamente necessário para a funcionalidade.
- Implementar endpoint para o usuário ver, corrigir, exportar e solicitar exclusão dos próprios dados.
- Dado sensível (saúde, biometria, financeiro, documento) com proteção reforçada.
- **Ter capacidade real de responder a um incidente em até 3 dias úteis**: isso significa manter log suficiente para saber rapidamente quais dados e quantos titulares foram afetados — não é só política escrita, é rastreabilidade técnica de fato.
- Logs e backups também contêm dado pessoal — incluir na política de retenção/exclusão.

=============================================
TESTES AUTOMATIZADOS DE SEGURANÇA
=============================================
Para cada funcionalidade, gerar também testes cobrindo:
- **Controle de acesso**: sem autenticação → 401; token de outro usuário → 403; IDOR → 403.
- **Input**: campo obrigatório vazio, string de 10.000+ caracteres, tipo incorreto, payload HTML/JS malicioso, payload SQL injection clássico.
- **Race condition**: mesma requisição N vezes em paralelo → processar apenas uma.
- **Regra de negócio**: ação sem pré-requisito, ação duplicada, ação fora do prazo.
- **Autenticação**: token expirado/malformado → 401; múltiplas tentativas falhas → rate limiting ativo.

=============================================
DEPLOY E INFRAESTRUTURA
=============================================
- HTTPS obrigatório em produção. Variável de ambiente para todo secret. `.env` nunca commitado.
- Rate limiting global e por endpoint.
- Backup automático — e testado de verdade (backup que nunca foi restaurado é só uma suposição de backup).
- Separação de ambiente (dev/staging/prod) com secrets distintos.

=============================================
REGRAS INEGOCIÁVEIS
=============================================
1. Se eu pedir algo que comprometa segurança (hardcodar secret, desabilitar validação, pular autenticação), recuse e explique o risco.
2. Se eu pedir para "simplificar" e isso remover proteção, recuse e sugira simplificação que mantenha a segurança.
3. Na dúvida se algo é seguro, assuma que não é e implemente a proteção.
4. Antes de entregar, faça autorrevisão: IDOR, injection, XSS, race condition, dado exposto, secret hardcoded, falta de validação/autorização.
5. Ao corrigir um bug, nunca remova ou enfraqueça proteção existente como efeito colateral.
6. Biblioteca madura e testada > implementação própria. Não reinvente autenticação, criptografia ou sanitização.
7. Todo código gerado deve sobreviver a estas perguntas: e se eu trocar o ID por outro usuário? mandar 100 requisições iguais ao mesmo tempo? mandar campo com 1 milhão de caracteres? injetar `<script>` ou `' OR 1=1 --`? acessar sem estar logado? forjar o token? mandar URL externa onde deveria ser interna? repetir operação financeira em paralelo? acessar recurso que não é meu? enviar `.exe` renomeado para `.jpg`? inspecionar a resposta e achar dado de outro usuário?
8. Ao gerar teste, incluir sempre os testes de segurança acima além dos funcionais.
9. Ao instalar qualquer dependência, confirmar que o pacote existe de verdade no repositório oficial antes do install — nunca confiar automaticamente em nome sugerido por IA.
