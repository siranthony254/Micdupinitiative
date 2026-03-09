import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/types/blog'

// GET /api/admin/blog/posts - Fetch all posts (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'draft' | 'published' | 'scheduled' | null
    const featured = searchParams.get('featured') === 'true'
    const categoryId = searchParams.get('category_id')
    const authorId = searchParams.get('author_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_profiles(id, full_name, avatar_url, role),
        category:blog_categories(id, name, slug),
        tags:blog_post_tags(
          blog_tags(id, name, slug)
        )
      `)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (featured) {
      query = query.eq('is_featured', true)
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    if (authorId) {
      query = query.eq('author_id', authorId)
    }
    if (search) {
      query = query.textSearch('search', search)
    }

    // Apply ordering and pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
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

// POST /api/admin/blog/posts - Create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const postData = {
      title: body.title,
      subtitle: body.subtitle || null,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || null,
      featured_image: body.featured_image || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      keywords: body.keywords || [],
      status: body.status || 'draft',
      is_featured: body.is_featured || false,
      category_id: body.category_id || null,
      author_id: body.author_id,
      publish_at: body.status === 'scheduled' ? body.publish_at : null
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Handle tags if provided
    if (body.tag_ids && body.tag_ids.length > 0) {
      const tagRelations = body.tag_ids.map((tagId: string) => ({
        post_id: data.id,
        tag_id: tagId
      }))

      const { error: tagError } = await supabase
        .from('blog_post_tags')
        .insert(tagRelations)

      if (tagError) {
        console.error('Error adding tags:', tagError)
        // Don't fail the whole request if tags fail
      }
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
