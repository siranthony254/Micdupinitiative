import { NextRequest, NextResponse } from 'next/server'
import { incrementPostShares } from '@/lib/blog'
import { sanityFetch } from '@/sanity/lib/live'

// POST /api/blog/posts/[slug]/share - Track post share
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Find the post by slug to get its ID
    const post = await sanityFetch({
      query: `*[_type == "post" && slug.current == $slug][0]._id`,
      params: { slug }
    })

    if (!post.data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const { error } = await incrementPostShares(post.data)

    if (error) {
      console.error('Error incrementing shares:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Share API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
