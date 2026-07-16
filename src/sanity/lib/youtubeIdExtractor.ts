import { useEffect } from 'react'
import { useFormValue } from 'sanity'

// Helper to extract YouTube ID from URL or iframe
export function extractYouTubeIdFromUrl(input: string): string | null {
  if (!input) return null
  
  // Try to extract from iframe src attribute
  const srcMatch = input.match(/src=["']([^"']+)["']/)
  if (srcMatch) {
    const url = srcMatch[1]
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (match?.[1]) return match[1]
  }
  
  // Try direct URL match
  const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (match?.[1]) return match[1]
  const match2 = input.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
  if (match2?.[1]) return match2[1]
  return null
}

/**
 * Hook to auto-extract YouTube ID from youtubeEmbed field
 * Usage: In a Sanity document hook plugin
 */
export function useYouTubeIdExtractor() {
  const youtubeEmbed = useFormValue(['youtubeEmbed'])
  
  useEffect(() => {
    if (typeof youtubeEmbed === 'string') {
      const extracted = extractYouTubeIdFromUrl(youtubeEmbed)
      if (extracted) {
        // Dispatch event to update the youtubeId field
        const event = new CustomEvent('updateYouTubeId', { 
          detail: { youtubeId: extracted } 
        })
        window.dispatchEvent(event)
      }
    }
  }, [youtubeEmbed])
}
