import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseMiddlewareClient } from '@/lib/supabase-server'

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  if (!isAdminRoute) {
    return res
  }

  // Admin routes must never be served from a cache.
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.headers.set('Pragma', 'no-cache')
  res.headers.set('Expires', '0')

  try {
    const accessToken = req.headers.get('authorization')?.replace('Bearer ', '')

    if (accessToken) {
      // API-style callers pass a bearer token directly.
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
      const bearerClient = createClient(supabaseUrl, supabaseAnonKey)

      const { data: { user }, error } = await bearerClient.auth.getUser(accessToken)

      if (error || !user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      const { data: profile } = await bearerClient
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.role === 'admin' || profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

      if (!isAdmin) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      }

      res.headers.set('x-user-id', user.id)
      res.headers.set('x-user-role', profile?.role || 'student')
      res.headers.set('x-is-admin', isAdmin.toString())
      return res
    }

    // Web requests: read the session from cookies via the SSR-aware client,
    // and re-verify against Supabase's auth server (getUser) rather than
    // trusting a possibly-stale session cookie (getSession).
    const supabase = createSupabaseMiddlewareClient(req, res)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.redirect(new URL('/auth/signin?message=Authentication required', req.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    res.headers.set('x-user-id', user.id)
    res.headers.set('x-user-role', profile?.role || 'student')
    res.headers.set('x-is-admin', isAdmin.toString())

    return res
  } catch (error) {
    console.error('Admin authentication error:', error)
    return NextResponse.redirect(new URL('/auth/signin?message=Authentication error', req.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
