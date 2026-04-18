import { sanityFetch } from '@/sanity/lib/live'
import type { SanityPost, SanityPostWithRelations, SanityCategory, SanityAuthor } from '@/types/blog'

// Server-only blog functions using sanityFetch (for React Server Components)

// Blog Posts
export async function getBlogPosts(options: {
  featured?: boolean
  limit?: number
  offset?: number
  category?: string
  author?: string
  search?: string
}) {
  try {
    const { featured, limit = 10, offset = 0, category, author, search } = options
    
    let query = `*[_type == "post"`
    if (featured) query += " && featured == true"
    if (category) query += ` && $category in categories[]->slug.current`
    if (author) query += ` && author->slug.current == $author`
    if (search) query += ` && (title match $search || excerpt match $search)`
    query += `] | order(publishedAt desc)[${offset}...${offset + limit}]`

    const posts = await sanityFetch({
      query,
      params: {
        ...(category ? { category } : {}),
        ...(author ? { author } : {}),
        ...(search ? { search: `*${search}*` } : {}),
      }
    })

    return { data: posts.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogPost(slug: string) {
  try {
    const post = await sanityFetch({
      query: `*[_type == "post" && slug.current == $slug][0]{
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
      }`,
      params: { slug }
    })

    return { data: post.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFeaturedPosts(limit: number = 3) {
  try {
    const posts = await sanityFetch({
      query: `*[_type == "post" && featured == true] | order(publishedAt desc)[0...${limit}]{
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
      }`
    })

    return { data: posts.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Categories
export async function getBlogCategories() {
  try {
    const categories = await sanityFetch({
      query: `*[_type == "category"] | order(title asc){
        _id,
        _type,
        title,
        slug,
        description
      }`
    })

    return { data: categories.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogCategory(slug: string) {
  try {
    const category = await sanityFetch({
      query: `*[_type == "category" && slug.current == $slug][0]{
        _id,
        _type,
        title,
        slug,
        description
      }`,
      params: { slug }
    })

    return { data: category.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Authors
export async function getBlogAuthors() {
  try {
    const authors = await sanityFetch({
      query: `*[_type == "author"] | order(name asc){
        _id,
        _type,
        name,
        slug,
        image,
        bio
      }`
    })

    return { data: authors.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogAuthor(slug: string) {
  try {
    const author = await sanityFetch({
      query: `*[_type == "author" && slug.current == $slug][0]{
        _id,
        _type,
        name,
        slug,
        image,
        bio
      }`,
      params: { slug }
    })

    return { data: author.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Comments
export async function getBlogComments(postId: string) {
  try {
    const comments = await sanityFetch({
      query: `*[_type == "comment" && post._ref == $postId] | order(_createdAt desc){
        _id,
        _type,
        _createdAt,
        content,
        author,
        post
      }`,
      params: { postId }
    })

    return { data: comments.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
