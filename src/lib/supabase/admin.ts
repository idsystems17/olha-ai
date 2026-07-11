import { createClient } from '@supabase/supabase-js'

// Usa a service_role key — só pode ser importado em código server-side
// (rotas /api, Server Actions). Nunca em componente 'use client'.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
