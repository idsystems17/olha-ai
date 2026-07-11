-- Olha Aí — schema inicial (tenants, items, anti-abuso de CPF, storage de fotos)

create extension if not exists "pgcrypto";

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  whatsapp text not null,
  cpf text not null unique,
  logo_url text,
  bio text,
  gradient_index smallint not null default 0 check (gradient_index between 0 and 7),
  trial_started_at timestamptz not null default now(),
  is_subscribed boolean not null default false,
  created_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9](-?[a-z0-9])*$' and length(slug) between 3 and 60),
  constraint name_length check (length(name) between 1 and 120),
  constraint bio_length check (bio is null or length(bio) <= 200)
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null check (price >= 0),
  description text,
  image_url text,
  is_available_today boolean not null default true,
  created_at timestamptz not null default now(),
  constraint item_name_length check (length(name) between 1 and 120),
  constraint item_description_length check (description is null or length(description) <= 500)
);

create index items_tenant_id_idx on public.items(tenant_id);

-- Anti-abuso: CPF usado fica registrado pra sempre, mesmo depois do tenant
-- ser excluído no fim do trial (regra do briefing: 1 CPF = 1 trial, sempre)
create table public.cpf_usados (
  cpf text primary key,
  used_at timestamptz not null default now()
);

alter table public.tenants enable row level security;
alter table public.items enable row level security;
alter table public.cpf_usados enable row level security;
-- cpf_usados não tem nenhuma policy de select/insert pra anon/authenticated:
-- só a service_role (rota server-side de cadastro) acessa essa tabela — fail closed por padrão

-- tenants: dono gerencia só a própria linha
create policy "dono_le_proprio_tenant" on public.tenants for select using (user_id = auth.uid());
create policy "dono_atualiza_proprio_tenant" on public.tenants for update using (user_id = auth.uid());
create policy "dono_insere_proprio_tenant" on public.tenants for insert with check (user_id = auth.uid());
create policy "dono_exclui_proprio_tenant" on public.tenants for delete using (user_id = auth.uid());

-- items: dono gerencia só os itens do próprio tenant
create policy "dono_le_proprios_items" on public.items for select
  using (tenant_id in (select id from public.tenants where user_id = auth.uid()));
create policy "dono_insere_proprios_items" on public.items for insert
  with check (tenant_id in (select id from public.tenants where user_id = auth.uid()));
create policy "dono_atualiza_proprios_items" on public.items for update
  using (tenant_id in (select id from public.tenants where user_id = auth.uid()));
create policy "dono_exclui_proprios_items" on public.items for delete
  using (tenant_id in (select id from public.tenants where user_id = auth.uid()));

-- Views públicas: só as colunas de vitrine (nunca cpf, nunca trial_started_at cru)
-- Rodam com o privilégio do dono da view, então funcionam pra "anon" mesmo com
-- RLS da tabela base restrita ao dono — é o padrão correto pra expor só o
-- necessário sem duplicar dado nem afrouxar a RLS da tabela real.
create view public.tenants_publicos as
select
  id,
  slug,
  name,
  logo_url,
  bio,
  gradient_index,
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

-- Storage: bucket público de fotos, organizado por {tenant_id}/{arquivo}
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "fotos_leitura_publica" on storage.objects for select
  using (bucket_id = 'fotos');

create policy "fotos_dono_insere" on storage.objects for insert
  with check (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] in (select id::text from public.tenants where user_id = auth.uid())
  );

create policy "fotos_dono_atualiza" on storage.objects for update
  using (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] in (select id::text from public.tenants where user_id = auth.uid())
  );

create policy "fotos_dono_exclui" on storage.objects for delete
  using (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] in (select id::text from public.tenants where user_id = auth.uid())
  );
