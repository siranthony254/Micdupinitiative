import { client } from '@/sanity/lib/client'

import type { SanityFAQ } from '@/types/faq'

import type { PortableTextBlock } from '@portabletext/types'

// GROQ Queries
const FAQS_QUERY = `*[_type == "faq"] | order(category asc, order asc, publishedAt desc) {
  _id,
  _type,
  question,
  answer,
  category,
  order,
  featured,
  publishedAt
}`

const FEATURED_FAQS_QUERY = `*[_type == "faq" && featured == true] | order(order asc, publishedAt desc) {
  _id,
  _type,
  question,
  answer,
  category,
  order,
  featured,
  publishedAt
}`

const FAQ_BY_CATEGORY_QUERY = `*[_type == "faq" && category == $category] | order(order asc, publishedAt desc) {
  _id,
  _type,
  question,
  answer,
  category,
  order,
  featured,
  publishedAt
}`

// FAQ Functions
export async function getFAQs(options: {
  featured?: boolean
  limit?: number
  offset?: number
  category?: string
}) {
  try {
    let query = `*[_type == "faq"`
    
    if (options.featured) {
      query += " && featured == true"
    }
    
    if (options.category) {
      query += ` && category == "${options.category}"`
    }
    
    query += `] | order(category asc, order asc, publishedAt desc)`
    
    if (options.limit) {
      query += ` [${options.offset || 0}...${(options.offset || 0) + options.limit}]`
    }

    query += ` {
      _id,
      _type,
      question,
      answer,
      category,
      order,
      featured,
      publishedAt
    }`

    const faqs = await client.fetch(query)

    return { data: faqs, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFeaturedFAQs(limit: number = 5) {
  try {
    const faqs = await client.fetch(`*[_type == "faq" && featured == true] | order(order asc, publishedAt desc)[0...${limit}] {
      _id,
      _type,
      question,
      answer,
      category,
      order,
      featured,
      publishedAt
    }`)

    return { data: faqs, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFAQsByCategory(category: string) {
  try {
    const faqs = await client.fetch(FAQ_BY_CATEGORY_QUERY, { category })
    return { data: faqs, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function getFAQCategories() {
  try {
    const categories = await client.fetch(`*[_type == "faq"] | order(category asc) {
      category
    }`)
    
    // Get unique categories
    const uniqueCategories = [...new Set(categories.map((cat: any) => cat.category))]
    
    return { data: uniqueCategories, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export async function searchFAQs(query: string, limit: number = 10) {
  try {
    const faqs = await client.fetch(
      `*[_type == "faq" && question match "*${query}*"] | order(category asc, order asc, publishedAt desc)[0...${limit}] {
        _id,
        _type,
        question,
        answer,
        category,
        order,
        featured,
        publishedAt
      }`
    )

    return { data: faqs, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Helper function to get category display name
export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    general: 'General',
    programs: 'Programs',
    membership: 'Membership',
    events: 'Events',
    partnerships: 'Partnerships',
    technical: 'Technical',
  }
  
  return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

// Helper function to group FAQs by category
export function groupFAQsByCategory(faqs: SanityFAQ[]) {
  return faqs.reduce((acc, faq) => {
    const category = faq.category || 'general'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(faq)
    return acc
  }, {} as Record<string, SanityFAQ[]>)
}
