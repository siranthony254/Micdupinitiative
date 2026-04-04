import { NextRequest, NextResponse } from 'next/server'
import { searchBlogPosts } from '@/lib/blog'

// GET /api/blog/search - Full-text search blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        error: 'Search query is required'
      }, { status: 400 })
    }

    const { data, error } = await searchBlogPosts(query, limit)

    if (error) {
      console.error('Error searching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      query,
      pagination: {
        limit,
        total: data?.length || 0
      }
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
