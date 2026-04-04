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
  } catch (error) {
    console.error('Create post API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }
    
    // Always use "Mic'd Up Initiative" as the author
    const authorName = "Mic'd Up Initiative"
    let { data: author } = await supabase
      .from('blog_authors')
      .select('id')
      .eq('name', authorName)
      .single()
    
    let authorId = author?.id
    
    // If author doesn't exist, create it
    if (!authorId) {
      const { data: newAuthor } = await supabase
        .from('blog_authors')
        .insert({
          name: authorName,
          bio: "Mic'd Up Initiative is a leading organization dedicated to empowering students and fostering leadership development on campus."
        })
        .select('id')
        .single()
      
      if (newAuthor) {
        authorId = newAuthor.id
        console.log('Created Mic\'d Up Initiative author:', newAuthor.id)
      }
    }
    
    if (!authorId) {
      return NextResponse.json({ error: 'Failed to create or find author "Mic\'d Up Initiative"' }, { status: 500 })
    }
    
    // Ensure category_id is provided - get first available category if not
    let categoryId = body.category_id
    if (!categoryId) {
      const { data: categories } = await supabase
        .from('blog_categories')
        .select('id')
        .limit(1)
      
      if (categories && categories.length > 0) {
        categoryId = categories[0].id
      } else {
        // Create a default category if none exists
        const { data: newCategory } = await supabase
          .from('blog_categories')
          .insert({
            name: 'General',
            slug: 'general',
            description: 'General category for blog posts'
          })
          .select('id')
          .single()
        
        if (newCategory) {
          categoryId = newCategory.id
        } else {
          return NextResponse.json({ error: 'Failed to create default category' }, { status: 500 })
        }
      }
    }
    
    const postData = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      slug: body.slug.trim(),
      content: body.content.trim(),
      excerpt: body.excerpt?.trim() || null,
      featured_image: body.featured_image?.trim() || null,
      meta_title: body.meta_title?.trim() || null,
      meta_description: body.meta_description?.trim() || null,
      keywords: body.keywords || [],
      status: body.status || 'draft',
      featured: body.featured || false,  // Use correct field name
      category_id: categoryId,
      author_id: authorId,
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
