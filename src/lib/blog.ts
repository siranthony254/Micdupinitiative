import { supabase } from '@/lib/supabase'
import type { BlogPost, BlogPostWithRelations, BlogCategory, BlogTag, BlogProfile, BlogComment } from '@/types/blog'

// Blog Posts
export async function getBlogPosts(options: {
  status?: 'published' | 'draft' | 'scheduled'
  featured?: boolean
  category_id?: string
  tag_id?: string
  author_id?: string
  limit?: number
  offset?: number
  search?: string
} = {}) {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(id, name, avatar_url),
      category:blog_categories(id, name, slug),
      tags:blog_post_tags(
        blog_tags(id, name, slug)
      )
    `)

  // Apply filters
  if (options.status) {
    query = query.eq('status', options.status)
  }
  if (options.featured) {
    query = query.eq('featured', true)
  }
  if (options.category_id) {
    query = query.eq('category_id', options.category_id)
  }
  if (options.author_id) {
    query = query.eq('author_id', options.author_id)
  }
  if (options.search) {
    query = query.textSearch('search', options.search)
  }

  // Apply ordering and pagination
  query = query
    .order('created_at', { ascending: false })
    .range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1)

  const { data, error } = await query
  return { data, error }
}

export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(id, name, avatar_url),
      category:blog_categories(id, name, slug),
      tags:blog_post_tags(
        blog_tags(id, name, slug)
      )
    `)
    .eq('slug', slug)
    .single()

  return { data, error }
}

export async function createBlogPost(post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single()

  return { data, error }
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  return { error }
}

// Categories
export async function getBlogCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  return { data, error }
}

export async function createBlogCategory(category: Partial<BlogCategory>) {
  const { data, error } = await supabase
    .from('blog_categories')
    .insert(category)
    .select()
    .single()

  return { data, error }
}

// Tags
export async function getBlogTags() {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name')

  return { data, error }
}

export async function createBlogTag(tag: Partial<BlogTag>) {
  const { data, error } = await supabase
    .from('blog_tags')
    .insert(tag)
    .select()
    .single()

  return { data, error }
}

// Post Tags
export async function updatePostTags(postId: string, tagIds: string[]) {
  // Delete existing tags
  await supabase
    .from('blog_post_tags')
    .delete()
    .eq('post_id', postId)

  // Insert new tags
  if (tagIds.length > 0) {
    const tagRelations = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }))

    const { error } = await supabase
      .from('blog_post_tags')
      .insert(tagRelations)

    return { error }
  }

  return { error: null }
}

// Comments
export async function getBlogCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .from('blog_comments')
    .select(`
      *,
      user:blog_profiles(id, full_name, avatar_url)
    `)
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: true })

  return { data, error }
}

export async function createBlogComment(comment: Partial<BlogComment>) {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert(comment)
    .select()
    .single()

  return { data, error }
}

// Analytics
export async function incrementPostViews(slug: string) {
  const { error } = await supabase.rpc('increment_blog_post_views', { post_slug: slug })
  return { error }
}

export async function incrementPostShares(postId: string) {
  const { error } = await supabase.rpc('increment_blog_post_shares', { post_id: postId })
  return { error }
}

// Search
export async function searchBlogPosts(query: string, limit = 10) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(id, name, avatar_url),
      category:blog_categories(id, name, slug),
      tags:blog_post_tags(
        blog_tags(id, name, slug)
      )
    `)
    .textSearch('search', query)
    .eq('status', 'published')
    .limit(limit)

  return { data, error }
}

// Blog Profile
export async function getBlogProfile(userId: string) {
  const { data, error } = await supabase
    .from('blog_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function updateBlogProfile(userId: string, profile: Partial<BlogProfile>) {
  const { data, error } = await supabase
    .from('blog_profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}
