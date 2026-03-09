import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
      publish_at: body.status === 'scheduled' ? body.publish_at : null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Update tags if provided
    if (body.tag_ids !== undefined) {
      // Delete existing tags
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('post_id', id)

      // Insert new tags
      if (body.tag_ids.length > 0) {
        const tagRelations = body.tag_ids.map((tagId: string) => ({
          post_id: id,
          tag_id: tagId
        }))

        const { error: tagError } = await supabase
          .from('blog_post_tags')
          .insert(tagRelations)

        if (tagError) {
          console.error('Error updating tags:', tagError)
          // Don't fail the whole request if tags fail
        }
      }
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
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

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
