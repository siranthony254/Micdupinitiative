import { PortableTextBlock } from '@portabletext/types'

export interface SanityVideo {
  _id: string
  _type: 'video'
  title?: string
  slug?: {
    current: string
  }
  description?: string
  youtubeEmbed: string
  youtubeId?: string
  vimeoId?: string
  selfHostedUrl?: string
  externalUrl?: string
  thumbnail?: {
    asset?: {
      _ref?: string
      _type?: string
    }
    alt?: string
  }
  primaryPlatform?: string
  social?: {
    youtube?: string | null
    spotify?: string | null
    apple?: string | null
    instagram?: string | null
    tiktok?: string | null
    facebook?: string | null
    x?: string | null
    linkedin?: string | null
  }
  type: 'podcast' | 'talk' | 'documentary' | 'interview' | 'workshop' | 'event'
  category?: string
  campus?: string
  duration?: string
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

// Helper function to extract YouTube ID from various URL formats
export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  
  // youtube.com/watch?v=ID format
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (match1 && match1[1]) return match1[1]
  
  // youtube.com/watch?v=ID&... format with additional params
  const match2 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
  if (match2 && match2[1]) return match2[1]
  
  // youtu.be/ID format
  const match3 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (match3 && match3[1]) return match3[1]
  
  return null
}
