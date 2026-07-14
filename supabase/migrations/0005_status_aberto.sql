-- Olha Aí — toggle manual de "aberto/fechado hoje" pro catálogo público.
-- Decisão da Izis: status real controlado por ela, mostrado na página
-- pública ao lado do WhatsApp (antes era um texto fixo "Aberto").
drop view public.items_publicos;
drop view public.tenants_publicos;

alter table public.tenants add column is_open_today boolean not null default true;

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
  is_open_today,
  (is_subscribed or trial_started_at > now() - interval '30 days') as is_active
from public.tenants;

grant select on public.tenants_publicos to anon, authenticated;

create view public.items_publicos as
select i.id, i.tenant_id, i.name, i.price, i.description, i.image_url, i.is_available_today
from public.items i
join public.tenants_publicos t on t.id = i.tenant_id
where t.is_active;

grant select on public.items_publicos to anon, authenticated;
