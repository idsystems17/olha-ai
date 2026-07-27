-- O cron diário de expiração de trial (src/app/api/cron/expirar-trials)
-- filtra por is_subscribed = false + trial_started_at antigo. Sem índice,
-- essa consulta varre a tabela tenants inteira todo dia — barato hoje com
-- poucas vendedoras, mas cresce junto com a base.
create index tenants_trial_status_idx on public.tenants(is_subscribed, trial_started_at);
