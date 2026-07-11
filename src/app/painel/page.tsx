import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PainelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, slug, trial_started_at, is_subscribed')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-bold text-slate-800">Painel — em construção</h1>
        <p className="text-sm text-slate-500 mt-2">
          Login funcionando! Editor de itens e personalização chegam na Fase 2.
        </p>
        {tenant && (
          <div className="mt-4 text-sm text-slate-600 space-y-1">
            <p><strong>Negócio:</strong> {tenant.name}</p>
            <p><strong>Link:</strong> /{tenant.slug}</p>
            <p><strong>Assinante:</strong> {tenant.is_subscribed ? 'Sim' : 'Não (trial)'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
