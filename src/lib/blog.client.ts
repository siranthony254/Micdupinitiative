import { client } from '@/sanity/lib/client'
import type { SanityPost, SanityPostWithRelations, SanityCategory, SanityAuthor, BlogTag, BlogComment } from '@/types/blog'

// Client-safe blog functions using client.fetch (for Client Components)

// Blog Posts
export async function getBlogPostsClient(options: {
  featured?: boolean
  limit?: number
  category?: string
}) {
  try {
    const { featured, limit = 10, category } = options
    
    let query = `*[_type == "post"`
    if (featured) query += " && featured == true"
    if (category) query += ` && "${category}" in categories[]->slug.current`
    query += `] | order(publishedAt desc)[0...${limit}]`

    const posts = await client.fetch(query)

    return { data: posts, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogPostClient(slug: string) {
  try {
    const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      author->{_id, _type, name, slug, image},
      categories[]->{_id, _type, title, slug},
      body,
      featured,
      readTime,
      views
    }`, { slug })

    return { data: post, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFeaturedPostsClient(limit: number = 3) {
  try {
    const posts = await client.fetch(`*[_type == "post" && featured == true] | order(publishedAt desc)[0...${limit}]{
      _id,
      _type,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      author->{_id, _type, name, slug, image},
      categories[]->{_id, _type, title, slug},
      featured,
      readTime,
      views
    }`)

    return { data: posts, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Categories
export async function getBlogCategoriesClient() {
  try {
    const categories = await client.fetch(`*[_type == "category"] | order(title asc){
      _id,
      _type,
      title,
      slug,
      description
    }`)

    return { data: categories, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogCategoryClient(slug: string) {
  try {
    const category = await client.fetch(`*[_type == "category" && slug.current == $slug][0]{
      _id,
      _type,
      title,
      slug,
      description
    }`, { slug })

    return { data: category, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Authors
export async function getBlogAuthorsClient() {
  try {
    const authors = await client.fetch(`*[_type == "author"] | order(name asc){
      _id,
      _type,
      name,
      slug,
      image,
      bio
    }`)

    return { data: authors, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogAuthorClient(slug: string) {
  try {
    const author = await client.fetch(`*[_type == "author" && slug.current == $slug][0]{
      _id,
      _type,
      name,
      slug,
      image,
      bio
    }`, { slug })

    return { data: author, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Comments
export async function getBlogCommentsClient(postId: string) {
  try {
    const comments = await client.fetch(`*[_type == "comment" && post._ref == $postId] | order(_createdAt desc){
      _id,
      _type,
      _createdAt,
      content,
      author,
      post
    }`, { postId })

    return { data: comments, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Standard export names for backward compatibility
export const getBlogComments = getBlogCommentsClient

// Add other standard exports
export const getBlogPosts = getBlogPostsClient
export const getBlogPost = getBlogPostClient  
export const getFeaturedPosts = getFeaturedPostsClient
export const getBlogCategories = getBlogCategoriesClient
export const getBlogCategory = getBlogCategoryClient
export const getBlogAuthors = getBlogAuthorsClient
export const getBlogAuthor = getBlogAuthorClient

// Analytics functions (client-safe)
export async function incrementPostViews(slug: string) {
  try {
    // Find the post by slug
    const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]._id`, { slug })
    
    if (!post) {
      throw new Error('Post not found')
    }

    // Increment views (this would typically be done with a mutation or API call)
    // For now, we'll just return success since we're not implementing mutations
    return { data: { success: true }, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function incrementPostShares(id: string) {
  try {
    // Similar to views, this would typically be a mutation
    return { data: { success: true }, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
