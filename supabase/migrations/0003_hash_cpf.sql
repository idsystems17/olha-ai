-- Olha Aí — troca CPF em texto puro por hash (HMAC-SHA256 com pepper só no
-- servidor). Continua bloqueando conta duplicada pelo mesmo CPF, mas não
-- guarda o número real em lugar nenhum — nem a Izis nem um vazamento de
-- banco conseguem recuperar o CPF a partir do hash sem o pepper.
-- Decisão da Izis (2026-07-12): reduzir o risco de acumular CPFs reais.

-- Nenhuma linha real neste momento do projeto (só testes descartáveis, já
-- limpos) — drop direto em vez de migrar dado existente.
alter table public.tenants drop column cpf;
alter table public.tenants add column cpf_hash text not null unique;

alter table public.cpf_usados rename column cpf to cpf_hash;
