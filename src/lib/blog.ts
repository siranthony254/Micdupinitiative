import { client } from '@/sanity/lib/client'

// GROQ Queries
const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
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
  author->{_id, _type, name, slug, image},
  categories[]->{_id, _type, title, slug}
}`

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  mainImage,
  publishedAt,
  excerpt,
  body,
  featured,
  readTime,
  views,
  shares,
  author->{_id, _type, name, slug, image},
  categories[]->{_id, _type, title, slug}
}`

const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  description
}`

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
    let query = `*[_type == "post"`
    const params: Record<string, string> = {}
    
    if (options.featured) {
      query += " && featured == true"
    }
    
    if (options.category) {
      query += ` && $category in categories[]->slug.current`
      params.category = options.category
    }
    
    if (options.author) {
      query += ` && author->slug.current == $author`
      params.author = options.author
    }

    if (options.search) {
      query += ` && (title match $search || excerpt match $search)`
      params.search = `*${options.search}*`
    }
    
    query += `] | order(publishedAt desc)`
    
    if (options.limit) {
      query += ` [${options.offset || 0}...${(options.offset || 0) + options.limit}]`
    }

    query += ` {
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
      author->{_id, _type, name, slug, image},
      categories[]->{_id, _type, title, slug}
    }`

    const posts = await client.fetch(query, params)

    return { data: posts, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogPost(slug: string) {
  try {
    const post = await client.fetch(POST_QUERY, { slug })
    return { data: post, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFeaturedPosts(limit: number = 3) {
  try {
    const posts = await client.fetch(`*[_type == "post" && featured == true] | order(publishedAt desc)[0...${limit}] {
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
      author->{_id, _type, name, slug, image},
      categories[]->{_id, _type, title, slug}
    }`)

    return { data: posts, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Categories
export async function getBlogCategories() {
  try {
    const categories = await client.fetch(CATEGORIES_QUERY)
    return { data: categories, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogCategory(slug: string) {
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

// Search
export async function searchBlogPosts(query: string, limit: number = 10) {
  try {
    const posts = await client.fetch(
      `*[_type == "post" && (title match $term || excerpt match $term)] | order(publishedAt desc)[0...${limit}] {
        _id,
        _type,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        author->{_id, _type, name, slug, image},
        categories[]->{_id, _type, title, slug}
      }`,
      { term: `*${query}*` }
    )

    return { data: posts, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Analytics (simplified - in a real app you'd track this in Sanity)
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

// Comments (if you want to add commenting functionality)
export async function getBlogComments(postId: string) {
  try {
    const comments = await client.fetch(`*[_type == "comment" && post._ref == $postId && approved == true] | order(_createdAt asc) {
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

// Content management should be done through Sanity Studio
