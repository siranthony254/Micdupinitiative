import { client } from '@/sanity/lib/client'

import type { SanityVideo, VideoFilter } from '@/types/video'
import type { MediaItem } from '@/components/media/types/media'
import { extractYouTubeId, extractYouTubeIdFromIframe, getYouTubeThumbnailUrl as getDerivedYouTubeThumbnailUrl, getYouTubeWatchUrl } from '@/lib/youtube'

// GROQ Queries
const VIDEO_FIELDS = `
  _id,
  _type,
  title,
  description,
  youtubeEmbed,
  type,
  category,
  campus,
  duration,
  featured,
  showInRail,
  publishedAt,
  expiryDate,
  order
`

const VIDEOS_QUERY = `*[_type == "video" && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  ${VIDEO_FIELDS}
}`

const FEATURED_VIDEOS_QUERY = `*[_type == "video" && featured == true && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  ${VIDEO_FIELDS}
}`

const VIDEOS_BY_TYPE_QUERY = `*[_type == "video" && type == $type && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  ${VIDEO_FIELDS}
}`

const RAIL_VIDEOS_QUERY = `*[_type == "video" && showInRail == true && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) [0...6] {
  ${VIDEO_FIELDS}
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

export function getVideoYouTubeId(video: Pick<SanityVideo, 'youtubeEmbed'>): string | null {
  return extractYouTubeId(video.youtubeEmbed) || extractYouTubeIdFromIframe(video.youtubeEmbed)
}

export function getVideoThumbnailUrl(video: Pick<SanityVideo, 'youtubeEmbed'>): string {
  return getDerivedYouTubeThumbnailUrl(getVideoYouTubeId(video))
}

export function toMediaItem(video: SanityVideo): MediaItem {
  const youtubeId = getVideoYouTubeId(video) ?? undefined

  return {
    id: video._id,
    type: video.type || 'talk',
    category: video.category || 'General',
    title: video.title || 'Untitled video',
    description: video.description || '',
    campus: video.campus || '',
    duration: video.duration,
    thumbnail: getDerivedYouTubeThumbnailUrl(youtubeId),
    primaryPlatform: 'youtube',
    youtubeId,
    externalUrl: getYouTubeWatchUrl(youtubeId),
    social: {
      youtube: getYouTubeWatchUrl(youtubeId) || null,
      spotify: null,
      apple: null,
      instagram: null,
      tiktok: null,
      facebook: null,
      x: null,
      linkedin: null,
    },
    featured: video.featured,
    showInRail: video.showInRail,
  }
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
