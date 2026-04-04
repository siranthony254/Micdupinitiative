import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import type { SanityPost, SanityPostWithRelations, SanityCategory, SanityAuthor, BlogTag, BlogComment } from '@/types/blog'

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
  author->{
    _id,
    _type,
    name,
    slug,
    image
  },
  categories[]->{
    _id,
    _type,
    title,
    slug
  }
}`

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
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
}`

const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  description
}`

const AUTHORS_QUERY = `*[_type == "author"] | order(name asc) {
  _id,
  _type,
  name,
  slug,
  image,
  bio
}`

// Blog Posts
export async function getBlogPosts(options: {
  featured?: boolean
  category?: string
  author?: string
  limit?: number
  offset?: number
} = {}) {
  try {
    let query = `*[_type == "post"`
    const params: Record<string, any> = {}

    if (options.featured) {
      query += ` && featured == true`
    }

    if (options.category) {
      query += ` && $category in categories[]->slug.current`
      params.category = options.category
    }

    if (options.author) {
      query += ` && author->slug.current == $author`
      params.author = options.author
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
      author->{
        _id,
        _type,
        name,
        slug,
        image
      },
      categories[]->{
        _id,
        _type,
        title,
        slug
      }
    }`

    const posts = await sanityFetch({ query, params })
    return { data: posts.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogPost(slug: string) {
  try {
    const post = await sanityFetch({
      query: POST_QUERY,
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
      query: `*[_type == "post" && featured == true] | order(publishedAt desc)[0...${limit}] {
        _id,
        _type,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        readTime,
        author->{
          _id,
          _type,
          name,
          slug,
          image
        }
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
    const categories = await sanityFetch({ query: CATEGORIES_QUERY })
    return { data: categories.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogCategory(slug: string) {
  try {
    const category = await sanityFetch({
      query: `*[_type == "category" && slug.current == $slug][0]`,
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
    const authors = await sanityFetch({ query: AUTHORS_QUERY })
    return { data: authors.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getBlogAuthor(slug: string) {
  try {
    const author = await sanityFetch({
      query: `*[_type == "author" && slug.current == $slug][0] {
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

// Search
export async function searchBlogPosts(query: string, limit: number = 10) {
  try {
    const posts = await sanityFetch({
      query: `*[_type == "post" && (title match $query || excerpt match $query)] | order(publishedAt desc)[0...${limit}] {
        _id,
        _type,
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        author->{
          _id,
          _type,
          name,
          slug,
          image
        },
        categories[]->{
          _id,
          _type,
          title,
          slug
        }
      }`,
      params: { query: `*${query}*` }
    })
    return { data: posts.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Admin functions (for creating/updating content via Sanity Studio)
export async function createBlogPost(post: Partial<SanityPost>) {
  try {
    const result = await client.create({
      _type: 'post',
      ...post
    })
    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function updateBlogPost(id: string, post: Partial<SanityPost>) {
  try {
    const result = await client.patch(id).set(post).commit()
    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await client.delete(id)
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Analytics (simplified - in a real app you'd track this in Sanity)
export async function incrementPostViews(slug: string) {
  try {
    // Find the post by slug
    const post = await sanityFetch({
      query: `*[_type == "post" && slug.current == $slug][0]._id`,
      params: { slug }
    })

    if (post.data) {
      // Increment views (this would require a custom field in Sanity)
      await client.patch(post.data).inc({ views: 1 }).commit()
    }

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

export async function incrementPostShares(id: string) {
  try {
    await client.patch(id).inc({ shares: 1 }).commit()
    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Comments (if you want to add commenting functionality)
export async function getBlogComments(postId: string) {
  try {
    const comments = await sanityFetch({
      query: `*[_type == "comment" && post._ref == $postId && approved == true] | order(_createdAt asc) {
        _id,
        _type,
        content,
        _createdAt,
        author->{
          _id,
          _type,
          name,
          image
        }
      }`,
      params: { postId }
    })
    return { data: comments.data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function createBlogComment(comment: {
  postId: string
  authorId: string
  content: PortableTextBlock[]
}) {
  try {
    const result = await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: comment.postId
      },
      author: {
        _type: 'reference',
        _ref: comment.authorId
      },
      content: comment.content,
      approved: false
    })
    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}
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
