import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Add session persistence headers
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.headers.set('Pragma', 'no-cache')
  res.headers.set('Expires', '0')

  // Check for admin routes and authenticate
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  if (isAdminRoute) {
    try {
      const accessToken = req.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!accessToken) {
        // For web requests, check session cookie
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          return NextResponse.redirect(new URL('/auth/signin?message=Authentication required', req.url))
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('id', session.user.id)
          .single()

        const isAdmin = profile?.role === 'admin' || profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

        if (!isAdmin) {
          return NextResponse.redirect(new URL('/unauthorized', req.url))
        }

        // Add admin headers for downstream use
        res.headers.set('x-user-id', session.user.id)
        res.headers.set('x-user-role', profile?.role || 'student')
        res.headers.set('x-is-admin', isAdmin.toString())
      } else {
        // For API requests with Bearer token
        const { data: { user }, error } = await supabase.auth.getUser(accessToken)
        
        if (error || !user) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('id', user.id)
          .single()

        const isAdmin = profile?.role === 'admin' || profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

        if (!isAdmin) {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        // Add admin headers for downstream use
        res.headers.set('x-user-id', user.id)
        res.headers.set('x-user-role', profile?.role || 'student')
        res.headers.set('x-is-admin', isAdmin.toString())
      }
    } catch (error) {
      console.error('Admin authentication error:', error)
      return NextResponse.redirect(new URL('/auth/signin?message=Authentication error', req.url))
    }
  }

  // Handle blog admin routes specifically
  if (pathname.startsWith('/admin/blog') || pathname.startsWith('/api/admin/blog')) {
    // Additional check for blog admin permissions
    const userId = res.headers.get('x-user-id')
    if (userId) {
      try {
        const { data: blogProfile } = await supabase
          .from('blog_profiles')
          .select('role')
          .eq('id', userId)
          .single()

        const hasBlogAdmin = blogProfile?.role === 'admin' || blogProfile?.role === 'editor'
        
        if (!hasBlogAdmin && res.headers.get('x-is-admin') !== 'true') {
          return pathname.startsWith('/api')
            ? NextResponse.json({ error: 'Blog admin access required' }, { status: 403 })
            : NextResponse.redirect(new URL('/unauthorized', req.url))
        }

        res.headers.set('x-blog-role', blogProfile?.role || 'author')
      } catch (error) {
        console.error('Blog admin check error:', error)
        // Continue without blog admin check for now
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}