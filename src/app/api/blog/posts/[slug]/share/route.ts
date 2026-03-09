import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/blog/posts/[slug]/share - Track post share
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()
    const platform = body.platform || 'unknown'

    // First get the post ID from slug
    const { data: postData, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (fetchError || !postData) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment share count using RPC function
    const { error } = await supabase.rpc('increment_blog_post_shares', { 
      post_id: postData.id 
    })

    if (error) {
      console.error('Error incrementing shares:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Track share details for analytics
    const { error: trackingError } = await supabase
      .from('blog_post_shares')
      .insert({
        post_id: postData.id,
        platform: platform
      })

    if (trackingError) {
      console.error('Error tracking share:', trackingError)
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
