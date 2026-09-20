import 'server-only'

export interface YouTubeVideoDetails {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  channelTitle: string
  viewCount?: string
}

/**
 * Fetches real title/description/thumbnail/stats from the YouTube Data API
 * v3 for a batch of video IDs (up to 50 per call, YouTube's own limit) -
 * one request for the whole page rather than one per video.
 *
 * Requires YOUTUBE_API_KEY (server-only env var, from a Google Cloud
 * project - console.cloud.google.com -> APIs & Services -> Credentials,
 * with the "YouTube Data API v3" enabled). Without it, or on any fetch
 * failure, this returns an empty map and callers should fall back to the
 * description already stored in Sanity for that video.
 */
export async function getYouTubeVideoDetails(
  videoIds: string[]
): Promise<Record<string, YouTubeVideoDetails>> {
  const apiKey = process.env.YOUTUBE_API_KEY
  const uniqueIds = Array.from(new Set(videoIds.filter(Boolean))).slice(0, 50)

  if (!apiKey || uniqueIds.length === 0) {
    return {}
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${uniqueIds.join(',')}&key=${apiKey}`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      console.warn('YouTube API request failed', res.status, await res.text())
      return {}
    }

    const data = await res.json()
    const result: Record<string, YouTubeVideoDetails> = {}

    for (const item of data.items ?? []) {
      result[item.id] = {
        id: item.id,
        title: item.snippet?.title ?? '',
        description: item.snippet?.description ?? '',
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.default?.url ??
          '',
        publishedAt: item.snippet?.publishedAt ?? '',
        channelTitle: item.snippet?.channelTitle ?? '',
        viewCount: item.statistics?.viewCount,
      }
    }

    return result
  } catch (err) {
    console.warn('YouTube API fetch failed', err)
    return {}
  }
}
