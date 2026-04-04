import { PortableTextBlock } from '@portabletext/types'

export interface SanityAuthor {
  _id: string
  _type: 'author'
  name: string
  slug: {
    current: string
  }
  image?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  bio?: PortableTextBlock[]
}

export interface SanityCategory {
  _id: string
  _type: 'category'
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface SanityPost {
  _id: string
  _type: 'post'
  title: string
  slug: {
    current: string
  }
  author?: {
    _ref: string
    _type: 'reference'
  } | SanityAuthor
  mainImage?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  categories?: Array<{
    _ref: string
    _type: 'reference'
  } | SanityCategory>
  publishedAt?: string
  body: PortableTextBlock[]
  excerpt?: string
  featured?: boolean
  readTime?: number
  views?: number
  shares?: number
}

export interface SanityPostWithRelations extends SanityPost {
  author?: SanityAuthor
  categories?: SanityCategory[]
}

// Legacy types for backward compatibility (mapped to Sanity)
export interface BlogAuthor extends SanityAuthor {}
export interface BlogCategory extends SanityCategory {}
export interface BlogPost extends SanityPost {}
export interface BlogPostWithRelations extends SanityPostWithRelations {}

// Additional types for admin functionality
export interface BlogTag {
  _id: string
  _type: 'tag'
  name: string
  slug: {
    current: string
  }
}

export interface BlogComment {
  _id: string
  _type: 'comment'
  post: {
    _ref: string
    _type: 'reference'
  }
  author: {
    _ref: string
    _type: 'reference'
  } | SanityAuthor
  content: PortableTextBlock[]
  approved: boolean
  _createdAt: string
}

export interface BlogProfile {
  _id: string
  _type: 'profile'
  name: string
  email: string
  avatar?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  role: 'author' | 'editor' | 'admin'
}
