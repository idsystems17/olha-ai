// Link de checkout com o tenant_id no parâmetro s1 — a Kiwify devolve esse
// valor em TrackingParameters.s1 no payload do webhook, é como sabemos qual
// tenant assinou (ver src/app/api/kiwify-webhook/route.ts).
export function linkCheckoutKiwify(tenantId: string): string {
  const base = process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_URL ?? ''
  if (!base) return ''
  const separador = base.includes('?') ? '&' : '?'
  return `${base}${separador}s1=${tenantId}`
}
