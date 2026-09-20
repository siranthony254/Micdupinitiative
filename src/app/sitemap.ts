import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { slugifyCategory } from '@/lib/conversations'

const BASE_URL = 'https://micdupinitiative.site'

const STATIC_ROUTES = [
  '',
  '/About/Vision-Mission',
  '/About/MUI-Leadership',
  '/Get-Involved/Ambassadors',
  '/Get-Involved/Partnerships',
  '/Get-Involved/Mentors',
  '/Get-Involved/ment-lead',
  '/Programs/Events',
  '/blog',
  '/contact',
  '/conversations',
  '/updates',
  '/mic-the-campus',
  '/privacy',
  '/cookie-policy',
  '/data-protection',
  '/research/faqs',
  '/videos',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }))

  try {
    const posts: Array<{ slug?: string; publishedAt?: string }> = await client.fetch(
      `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, publishedAt }`
    )
    const postEntries: MetadataRoute.Sitemap = posts
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      }))

    const videos: Array<{ _id: string; publishedAt?: string; category?: string }> = await client.fetch(
      `*[_type == "video"]{ _id, publishedAt, category }`
    )
    const videoEntries: MetadataRoute.Sitemap = videos.map((video) => ({
      url: `${BASE_URL}/videos/${video._id}`,
      lastModified: video.publishedAt ? new Date(video.publishedAt) : new Date(),
    }))

    const categorySlugs = new Set(
      videos
        .map((video) => (video.category ? slugifyCategory(video.category) : ''))
        .filter(Boolean)
    )
    const categoryEntries: MetadataRoute.Sitemap = Array.from(categorySlugs).map((slug) => ({
      url: `${BASE_URL}/conversations/category/${slug}`,
      lastModified: new Date(),
    }))

    return [...staticEntries, ...postEntries, ...videoEntries, ...categoryEntries]
  } catch (err) {
    console.warn('sitemap: failed to fetch dynamic entries', err)
    return staticEntries
  }
}
