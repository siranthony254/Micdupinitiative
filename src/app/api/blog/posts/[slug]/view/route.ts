import { NextRequest, NextResponse } from 'next/server'
import { incrementPostViews } from '@/lib/blog'

// POST /api/blog/posts/[slug]/view - Track post view
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { error } = await incrementPostViews(slug)

    if (error) {
      console.error('Error incrementing views:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
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
        post_id: post.id,
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
