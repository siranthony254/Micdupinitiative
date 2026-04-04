import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog'

// GET /api/blog/posts - Get blog posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await getBlogPosts({
      featured,
      category: category || undefined,
      author: author || undefined,
      limit,
      offset
    })

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        limit,
        offset,
        total: data?.length || 0
      }
    })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
