import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create Supabase client for middleware
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Protected routes
  // NOTE: We only protect admin on the server side.
  // Other MUI Portal pages use client-side auth guards via AuthProvider.
  const protectedRoutes = ['/mui-portal/admin']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      const redirectUrl = new URL('/mui-portal/login', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Additional check for admin routes
    if (req.nextUrl.pathname.startsWith('/mui-portal/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/mui-portal/dashboard', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.svg|api).*)',
  ],
}
