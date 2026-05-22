export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.replace(/^www\./, '')

    if (hostname === 'youtu.be') {
      return parsedUrl.pathname.split('/').filter(Boolean)[0] ?? null
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'youtube-nocookie.com') {
      if (parsedUrl.pathname === '/watch') {
        return parsedUrl.searchParams.get('v')
      }

      const [, route, id] = parsedUrl.pathname.split('/')
      if (['embed', 'shorts', 'live'].includes(route)) {
        return id ?? null
      }
    }
  } catch {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match?.[1] ?? null
  }

  return null
}

export function getYouTubeThumbnailUrl(videoId?: string | null) {
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''
}

export function getYouTubeWatchUrl(videoId?: string | null) {
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''
}
