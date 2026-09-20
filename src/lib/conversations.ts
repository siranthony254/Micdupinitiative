import 'server-only'
import { getVideos, getVideoThumbnailUrl } from '@/lib/videos'
import type { SanityVideo } from '@/types/video'

export interface VideoCategory {
  name: string
  slug: string
  videos: SanityVideo[]
  thumbnailUrl: string
}

/** Turns "Faith & Spiritual Growth" into "faith-spiritual-growth". */
export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Groups all published videos by their (free-text) category field into
 * playlist-style buckets, sorted by how many videos each has. Videos with
 * no category set are excluded - they have nothing to be "featured in a
 * playlist" as, and showing an "Uncategorized" tile would be more
 * confusing than useful.
 */
export async function getVideoCategories(): Promise<VideoCategory[]> {
  const { data } = await getVideos({})
  const videos = (data ?? []) as SanityVideo[]

  const buckets = new Map<string, { name: string; videos: SanityVideo[] }>()

  for (const video of videos) {
    const raw = video.category?.trim()
    if (!raw) continue

    const slug = slugifyCategory(raw)
    if (!slug) continue

    const bucket = buckets.get(slug)
    if (bucket) {
      bucket.videos.push(video)
    } else {
      buckets.set(slug, { name: raw, videos: [video] })
    }
  }

  return Array.from(buckets.entries())
    .map(([slug, { name, videos }]) => ({
      name,
      slug,
      videos,
      thumbnailUrl: getVideoThumbnailUrl(videos[0]),
    }))
    .sort((a, b) => b.videos.length - a.videos.length)
}

/** Fetches every video whose category slugifies to the given slug. */
export async function getVideosByCategorySlug(
  slug: string
): Promise<{ name: string; videos: SanityVideo[] } | null> {
  const categories = await getVideoCategories()
  const match = categories.find((category) => category.slug === slug)
  return match ? { name: match.name, videos: match.videos } : null
}
