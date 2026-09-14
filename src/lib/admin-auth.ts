import { createSupabaseServerClient } from '@/lib/supabase-server'

type AdminCheckResult =
  | { ok: true; userId: string }
  | { ok: false; status: 401 | 403 }

/**
 * Re-verifies the caller is a signed-in admin, independent of anything
 * src/proxy.ts already forwarded as headers. Every mutating /api/admin/*
 * route calls this before touching the Sanity write client.
 */
export async function requireAdmin(): Promise<AdminCheckResult> {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { ok: false, status: 401 }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin' || profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  if (!isAdmin) {
    return { ok: false, status: 403 }
  }

  return { ok: true, userId: user.id }
}
