import { PortableTextBlock } from '@portabletext/types'

export interface SanityUpdate {
  _id: string
  _type: 'update'
  title: string
  description: string
  content: PortableTextBlock[]
  type: 'podcast' | 'blog' | 'event' | 'tour' | 'general' | 'announcement' | 'partnership' | 'mentorship'
  image?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  link?: string
  featured?: boolean
  order?: number
  publishedAt?: string
  expiryDate?: string
}

export interface UpdateGroup {
  type: string
  displayName: string
  updates: SanityUpdate[]
}

export interface UpdateFilter {
  type?: string
  featured?: boolean
  limit?: number
  offset?: number
}

export interface UpdateSearchResult {
  updates: SanityUpdate[]
  total: number
  query: string
}
