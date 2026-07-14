-- Olha Aí — idempotência do webhook da Kiwify. Cada evento de pagamento tem
-- um order_id único da Kiwify; guardamos os já processados pra não aplicar
-- o mesmo evento duas vezes se a Kiwify reenviar (retry).
create table public.kiwify_eventos_processados (
  order_id text primary key,
  webhook_event_type text not null,
  tenant_id uuid references public.tenants(id) on delete set null,
  processed_at timestamptz not null default now()
);

alter table public.kiwify_eventos_processados enable row level security;
-- Sem policy nenhuma pra anon/authenticated — só a service_role (rota do
-- webhook, server-side) acessa essa tabela. Mesmo padrão de cpf_usados.
