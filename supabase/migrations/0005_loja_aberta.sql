-- Olha Aí — interruptor "loja aberta/fechada". Quando fechada, o catálogo
-- continua visível (cliente navega o cardápio) mas nenhum botão de pedir
-- fica clicável. Serve pra folga/viagem/imprevisto, e também pro catálogo
-- de exemplo da landing page (fechado permanentemente, sem número de
-- WhatsApp real clicável).
alter table public.tenants add column is_open boolean not null default true;

-- View precisa sumir antes de mexer, mesmo padrão das migrations anteriores
drop view public.items_publicos;
drop view public.tenants_publicos;

create view public.tenants_publicos as
select
  id,
  slug,
  name,
  logo_url,
  bio,
  cor_principal,
  cor_secundaria,
  whatsapp,
  is_open,
  (is_subscribed or trial_started_at > now() - interval '30 days') as is_active
from public.tenants;

grant select on public.tenants_publicos to anon, authenticated;

create view public.items_publicos as
select i.id, i.tenant_id, i.name, i.price, i.description, i.image_url, i.is_available_today
from public.items i
join public.tenants_publicos t on t.id = i.tenant_id
where t.is_active;

grant select on public.items_publicos to anon, authenticated;
