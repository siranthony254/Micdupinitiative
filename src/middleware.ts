import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing in middleware.')
    return res
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Protected routes
    const protectedRoutes = ['/mui-portal/dashboard', '/mui-portal/courses', '/mui-portal/cohorts', '/mui-portal/admin']
    const isProtectedRoute = protectedRoutes.some(route =>
      req.nextUrl.pathname.startsWith(route)
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/mui-portal/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Additional check for admin routes
    if (session && req.nextUrl.pathname.startsWith('/mui-portal/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/mui-portal/dashboard', req.url))
      }
    }
  } catch (error) {
    console.error('Middleware error:', error)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.svg|api).*)',
  ],
}
