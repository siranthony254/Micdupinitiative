import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/blog/search - Full-text search blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Search query is required' 
      }, { status: 400 })
    }

    // Perform full-text search
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        created_at,
        view_count,
        share_count,
        author:blog_profiles(id, full_name, avatar_url),
        category:blog_categories(id, name, slug)
      `)
      .textSearch('search', query)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error searching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      query,
      pagination: {
        limit,
        offset,
        total: count || 0
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
