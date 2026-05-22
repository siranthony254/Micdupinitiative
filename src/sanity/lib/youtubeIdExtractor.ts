import { useEffect } from 'react'
import { useFormValue } from 'sanity'

// Helper to extract YouTube ID from URL
export function extractYouTubeIdFromUrl(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (match?.[1]) return match[1]
  const match2 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
  if (match2?.[1]) return match2[1]
  return null
}

/**
 * Hook to auto-extract YouTube ID from youtubeUrl field
 * Usage: In a Sanity document hook plugin
 */
export function useYouTubeIdExtractor() {
  const youtubeUrl = useFormValue(['youtubeUrl'])
  
  useEffect(() => {
    if (typeof youtubeUrl === 'string') {
      const extracted = extractYouTubeIdFromUrl(youtubeUrl)
      if (extracted) {
        // Dispatch event to update the youtubeId field
        const event = new CustomEvent('updateYouTubeId', { 
          detail: { youtubeId: extracted } 
        })
        window.dispatchEvent(event)
      }
    }
  }, [youtubeUrl])
}
