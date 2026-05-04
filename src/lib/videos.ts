import { client } from '@/sanity/lib/client'

import type { SanityVideo, VideoFilter } from '@/types/video'

// GROQ Queries
const VIDEOS_QUERY = `*[_type == "video" && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  description,
  type,
  category,
  campus,
  duration,
  thumbnail,
  primaryPlatform,
  youtubeId,
  vimeoId,
  selfHostedUrl,
  externalUrl,
  social,
  featured,
  showInRail,
  comingSoon,
  publishedAt,
  expiryDate,
  order,
  content,
  tags,
  guests
}`

const FEATURED_VIDEOS_QUERY = `*[_type == "video" && featured == true && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  description,
  type,
  category,
  campus,
  duration,
  thumbnail,
  primaryPlatform,
  youtubeId,
  vimeoId,
  selfHostedUrl,
  externalUrl,
  social,
  featured,
  showInRail,
  comingSoon,
  publishedAt,
  expiryDate,
  order,
  content,
  tags,
  guests
}`

const VIDEOS_BY_TYPE_QUERY = `*[_type == "video" && type == $type && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  description,
  type,
  category,
  campus,
  duration,
  thumbnail,
  primaryPlatform,
  youtubeId,
  vimeoId,
  selfHostedUrl,
  externalUrl,
  social,
  featured,
  showInRail,
  comingSoon,
  publishedAt,
  expiryDate,
  order,
  content,
  tags,
  guests
}`

const RAIL_VIDEOS_QUERY = `*[_type == "video" && showInRail == true && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) [0...6] {
  _id,
  _type,
  title,
  slug,
  description,
  type,
  category,
  campus,
  duration,
  thumbnail,
  primaryPlatform,
  youtubeId,
  vimeoId,
  selfHostedUrl,
  externalUrl,
  social,
  featured,
  showInRail,
  comingSoon,
  publishedAt,
  expiryDate,
  order,
  content,
  tags,
  guests
}`

// Video Functions
export async function getVideos(options: VideoFilter = {}) {
  try {
    let query = VIDEOS_QUERY
    
    if (options.featured) {
      query = FEATURED_VIDEOS_QUERY
    }
    
    if (options.type) {
      query = VIDEOS_BY_TYPE_QUERY.replace('$type', `"${options.type}"`)
    }
    
    if (options.showInRail) {
      query = RAIL_VIDEOS_QUERY
    }
    
    if (options.limit) {
      query += `[${options.offset || 0}...${(options.offset || 0) + options.limit}]`
    }
    
    if (options.search) {
      query = query.replace('*[_type == "video"', `*[_type == "video" && (title match "*${options.search}*" || description match "*${options.search}*")`)
    }

    const videos = await client.fetch(query)
    
    return { data: videos, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFeaturedVideos(limit: number = 6) {
  try {
    const videos = await client.fetch(`${FEATURED_VIDEOS_QUERY}[0...${limit}]`)
    return { data: videos, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getVideosByType(type: string, limit?: number) {
  try {
    let query = VIDEOS_BY_TYPE_QUERY.replace('$type', `"${type}"`)
    
    if (limit) {
      query += `[0...${limit}]`
    }

    const videos = await client.fetch(query)
    return { data: videos, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getRailVideos() {
  try {
    const videos = await client.fetch(RAIL_VIDEOS_QUERY)
    return { data: videos, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function searchVideos(query: string, limit: number = 10) {
  try {
    const videos = await client.fetch(`*[_type == "video" && (title match "*${query}*" || description match "*${query}*") && (!defined(expiryDate) || expiryDate > now())] | order(publishedAt desc)[0...${limit}] {
      _id,
      _type,
      title,
      slug,
      description,
      type,
      category,
      campus,
      duration,
      thumbnail,
      primaryPlatform,
      youtubeId,
      vimeoId,
      selfHostedUrl,
      externalUrl,
      social,
      featured,
      showInRail,
      comingSoon,
      publishedAt,
      expiryDate,
      order,
      content,
      tags,
      guests
    }`)

    return { data: videos, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getVideoTypes() {
  try {
    const types = await client.fetch(`*[_type == "video"] | order(type asc) {
      type
    }`)
    
    // Get unique types
    const uniqueTypes = [...new Set(types.map((video: any) => video.type))]
    
    return { data: uniqueTypes, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getVideoCategories() {
  try {
    const categories = await client.fetch(`*[_type == "video"] | order(category asc) {
      category
    }`)
    
    // Get unique categories
    const uniqueCategories = [...new Set(types.map((video: any) => video.category))]
    
    return { data: uniqueCategories, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getVideoBySlug(slug: string) {
  try {
    const video = await client.fetch(`*[_type == "video" && slug.current == $slug && (!defined(expiryDate) || expiryDate > now())][0]{
      _id,
      _type,
      title,
      slug,
      description,
      type,
      category,
      campus,
      duration,
      thumbnail,
      primaryPlatform,
      youtubeId,
      vimeoId,
      selfHostedUrl,
      externalUrl,
      social,
      featured,
      showInRail,
      comingSoon,
      publishedAt,
      expiryDate,
      order,
      content,
      tags,
      guests
    }`)
    
    return { data: video, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Helper function to get type display name
export function getTypeDisplayName(type: string): string {
  const typeNames: Record<string, string> = {
    podcast: 'Podcasts',
    talk: 'Talks',
    documentary: 'Documentaries',
    interview: 'Interviews',
    workshop: 'Workshops',
    event: 'Events',
  }
  
  return typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

// Helper function to group videos by type
export function groupVideosByType(videos: SanityVideo[]) {
  return videos.reduce((acc, video) => {
    const type = video.type || 'podcast'
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(video)
    return acc
  }, {} as Record<string, SanityVideo[]>)
}

// Helper function to get YouTube URL from ID
export function getYouTubeUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

// Helper function to get YouTube thumbnail URL from ID
export function getYouTubeThumbnailUrl(youtubeId: string, quality: 'default' | 'medium' | 'high' = 'default'): string {
  const qualityMap = {
    default: 'hqdefault',
    medium: 'mqdefault',
    high: 'hqdefault'
  }
  
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}.jpg`
}
