import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts, createBlogPost } from '@/lib/blog'
import type { SanityPost } from '@/types/blog'

// GET /api/admin/blog/posts - Fetch all posts (admin only)
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
    console.error('Admin posts API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/blog/posts - Create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const postData: Partial<SanityPost> = {
      title: body.title,
      slug: { current: body.slug },
      body: body.body,
      excerpt: body.excerpt,
      mainImage: body.mainImage,
      publishedAt: body.publishedAt,
      featured: body.featured || false,
      author: { _type: 'reference', _ref: body.authorId },
      categories: body.categoryIds?.map((id: string) => ({ _type: 'reference', _ref: id })) || []
    }

    const { data, error } = await createBlogPost(postData)

    if (error) {
      console.error('Error creating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
