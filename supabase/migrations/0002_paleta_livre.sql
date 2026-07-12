-- Olha Aí — troca o gradient_index (8 pares fechados) por cor principal +
-- cor secundária opcional, escolhidas de uma paleta fechada de cores soltas.
-- Decisão da Izis (2026-07-12): mais combinações, ainda sem builder livre —
-- as cores em si continuam vindo de uma lista fixa, só a combinação é livre.

-- Views precisam sumir antes de mexer nas colunas que elas referenciam
drop view public.items_publicos;
drop view public.tenants_publicos;

alter table public.tenants
  add column cor_principal text not null default '#1e293b',
  add column cor_secundaria text;

alter table public.tenants
  add constraint cor_principal_formato check (cor_principal ~ '^#[0-9a-fA-F]{6}$'),
  add constraint cor_secundaria_formato check (cor_secundaria is null or cor_secundaria ~ '^#[0-9a-fA-F]{6}$');

alter table public.tenants drop column gradient_index;

-- Recria as views públicas já com as novas colunas
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
  (is_subscribed or trial_started_at > now() - interval '30 days') as is_active
from public.tenants;

grant select on public.tenants_publicos to anon, authenticated;

create view public.items_publicos as
select i.id, i.tenant_id, i.name, i.price, i.description, i.image_url, i.is_available_today
from public.items i
join public.tenants_publicos t on t.id = i.tenant_id
where t.is_active;

grant select on public.items_publicos to anon, authenticated;
