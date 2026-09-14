import { createServerClient } from '@supabase/ssr'
import type { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

/**
 * For Server Components and Route Handlers. Reads/writes the session cookie
 * via next/headers. Cookie writes from a Server Component are a no-op (Next
 * disallows it there) - Route Handlers and Server Actions can actually
 * refresh the session cookie.
 */
export async function createSupabaseServerClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Called from a Server Component that can't set cookies - safe to
          // ignore as long as middleware is refreshing the session.
        }
      },
    },
  })
}

/**
 * For src/proxy.ts (middleware). Reads the session cookie from the incoming
 * request and writes any refreshed session cookie onto both the outgoing
 * response and the forwarded request, so downstream Server Components in
 * the same request see the refreshed session.
 */
export function createSupabaseMiddlewareClient(request: NextRequest, response: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
}
