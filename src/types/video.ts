export interface SanityVideo {
  _id: string
  _type: 'video'
  title?: string
  description?: string
  youtubeEmbed: string
  type: 'podcast' | 'talk' | 'documentary' | 'interview' | 'workshop' | 'event'
  category?: string
  campus?: string
  duration?: string
  featured?: boolean
  showInRail?: boolean
  publishedAt?: string
  expiryDate?: string
  order?: number
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
