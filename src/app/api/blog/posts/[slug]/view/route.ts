import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/blog/posts/[slug]/view - Track post view
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const viewerIp = searchParams.get('ip') || request.ip
    const userAgent = request.headers.get('user-agent') || undefined

    // Increment view count using RPC function
    const { error } = await supabase.rpc('increment_blog_post_views', { 
      post_slug: slug 
    })

    if (error) {
      console.error('Error incrementing views:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Track view details for analytics
    const { error: trackingError } = await supabase
      .from('blog_post_views')
      .insert({
        post_id: null, // We'll need to fetch the post ID first
        viewer_ip: viewerIp,
        user_agent: userAgent
      })

    if (trackingError) {
      console.error('Error tracking view:', trackingError)
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
