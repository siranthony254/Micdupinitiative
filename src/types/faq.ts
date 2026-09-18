import { PortableTextBlock } from '@portabletext/types'

export interface SanityFAQ {
  _id: string
  _type: 'faq'
  question: string
  answer: PortableTextBlock[]
  category: 'general' | 'programs' | 'membership' | 'events' | 'partnerships' | 'technical'
  order?: number
  featured?: boolean
  publishedAt?: string
}

