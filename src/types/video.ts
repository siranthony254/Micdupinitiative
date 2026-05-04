import { PortableTextBlock } from '@portabletext/types'

export interface SanityVideo {
  _id: string
  _type: 'video'
  title: string
  slug: {
    current: string
  }
  description: string
  type: 'podcast' | 'talk' | 'documentary' | 'interview' | 'workshop' | 'event'
  category: string
  campus: string
  duration: string
  thumbnail?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  primaryPlatform: 'youtube' | 'vimeo' | 'self-hosted'
  youtubeId?: string
  vimeoId?: string
  selfHostedUrl?: string
  externalUrl?: string
  social?: {
    youtube?: string
    twitter?: string
    instagram?: string
    facebook?: string
  }
  featured?: boolean
  showInRail?: boolean
  comingSoon?: boolean
  publishedAt?: string
  expiryDate?: string
  order?: number
  content?: PortableTextBlock[]
  tags?: string[]
  guests?: string[]
}

export interface VideoFilter {
  type?: string
  category?: string
  campus?: string
  featured?: boolean
  showInRail?: boolean
  limit?: number
  offset?: number
  search?: string
}

export interface VideoGroup {
  type: string
  displayName: string
  videos: SanityVideo[]
}

export interface VideoSearchResult {
  videos: SanityVideo[]
  total: number
  query: string
}
