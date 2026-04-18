import { client } from '@/sanity/lib/client'

import type { SanityUpdate, UpdateFilter } from '@/types/update'

import type { PortableTextBlock } from '@portabletext/types'

// GROQ Queries
const UPDATES_QUERY = `*[_type == "update" && (!defined(expiryDate) || expiryDate > now())] | order(type asc, order asc, publishedAt desc) {
  _id,
  _type,
  title,
  description,
  content,
  type,
  image,
  link,
  featured,
  order,
  publishedAt,
  expiryDate
}`

const FEATURED_UPDATES_QUERY = `*[_type == "update" && featured == true && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  _id,
  _type,
  title,
  description,
  content,
  type,
  image,
  link,
  featured,
  order,
  publishedAt,
  expiryDate
}`

const UPDATES_BY_TYPE_QUERY = `*[_type == "update" && type == $type && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc) {
  _id,
  _type,
  title,
  description,
  content,
  type,
  image,
  link,
  featured,
  order,
  publishedAt,
  expiryDate
}`

// Update Functions
export async function getUpdates(options: UpdateFilter = {}) {
  try {
    let query = `*[_type == "update" && (!defined(expiryDate) || expiryDate > now())`
    
    if (options.featured) {
      query += " && featured == true"
    }
    
    if (options.type) {
      query += ` && type == "${options.type}"`
    }
    
    query += `] | order(type asc, order asc, publishedAt desc)`
    
    if (options.limit) {
      query += ` [${options.offset || 0}...${(options.offset || 0) + options.limit}]`
    }

    query += ` {
      _id,
      _type,
      title,
      description,
      content,
      type,
      image,
      link,
      featured,
      order,
      publishedAt,
      expiryDate
    }`

    const updates = await client.fetch(query)

    return { data: updates, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFeaturedUpdates(limit: number = 5) {
  try {
    const updates = await client.fetch(`*[_type == "update" && featured == true && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc)[0...${limit}] {
      _id,
      _type,
      title,
      description,
      content,
      type,
      image,
      link,
      featured,
      order,
      publishedAt,
      expiryDate
    }`)

    return { data: updates, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getUpdatesByType(type: string, limit?: number) {
  try {
    let query = `*[_type == "update" && type == "${type}" && (!defined(expiryDate) || expiryDate > now())] | order(order asc, publishedAt desc)`
    
    if (limit) {
      query += `[0...${limit}]`
    }

    query += ` {
      _id,
      _type,
      title,
      description,
      content,
      type,
      image,
      link,
      featured,
      order,
      publishedAt,
      expiryDate
    }`

    const updates = await client.fetch(query)
    return { data: updates, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getUpdateTypes() {
  try {
    const types = await client.fetch(`*[_type == "update"] | order(type asc) {
      type
    }`)
    
    // Get unique types
    const uniqueTypes = [...new Set(types.map((update: any) => update.type))]
    
    return { data: uniqueTypes, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function searchUpdates(query: string, limit: number = 10) {
  try {
    const updates = await client.fetch(
      `*[_type == "update" && (title match "*${query}*" || description match "*${query}*") && (!defined(expiryDate) || expiryDate > now())] | order(publishedAt desc)[0...${limit}] {
        _id,
        _type,
        title,
        description,
        content,
        type,
        image,
        link,
        featured,
        order,
        publishedAt,
        expiryDate
      }`
    )

    return { data: updates, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Helper function to get type display name
export function getTypeDisplayName(type: string): string {
  const typeNames: Record<string, string> = {
    podcast: 'Podcast Episodes',
    blog: 'Blog Posts',
    event: 'Events',
    tour: 'Campus Tours',
    general: 'General Updates',
    announcement: 'Announcements',
    partnership: 'Partnerships',
    mentorship: 'Mentorship',
  }
  
  return typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

// Helper function to group updates by type
export function groupUpdatesByType(updates: SanityUpdate[]) {
  return updates.reduce((acc, update) => {
    const type = update.type || 'general'
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(update)
    return acc
  }, {} as Record<string, SanityUpdate[]>)
}
