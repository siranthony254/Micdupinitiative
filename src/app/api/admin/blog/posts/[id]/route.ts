import { NextRequest, NextResponse } from 'next/server'
import { getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/blog'
import { sanityFetch } from '@/sanity/lib/live'

// GET /api/admin/blog/posts/[id] - Get single post (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await sanityFetch({
      query: `*[_type == "post" && _id == $id][0] {
        _id,
        _type,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        featured,
        readTime,
        views,
        shares,
        body,
        author->{
          _id,
          _type,
          name,
          slug,
          image,
          bio
        },
        categories[]->{
          _id,
          _type,
          title,
          slug,
          description
        }
      }`,
      params: { id }
    })

    if (!post.data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ data: post.data })
  } catch (error) {
    console.error('Get post API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/blog/posts/[id] - Update post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const postData = {
      title: body.title,
      slug: { current: body.slug },
      body: body.body,
      excerpt: body.excerpt,
      mainImage: body.mainImage,
      publishedAt: body.publishedAt,
      featured: body.featured || false,
      author: body.authorId ? { _type: 'reference', _ref: body.authorId } : undefined,
      categories: body.categoryIds?.map((catId: string) => ({ _type: 'reference', _ref: catId })) || []
    }

    const { data, error } = await updateBlogPost(id, postData)

    if (error) {
      console.error('Error updating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Update post API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/blog/posts/[id] - Delete post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await deleteBlogPost(id)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

