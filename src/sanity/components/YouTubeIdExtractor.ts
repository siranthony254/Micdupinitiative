import { useCallback, useEffect, useState } from 'react'
import { set } from 'sanity'

// Extract YouTube ID from various URL formats
export function extractYouTubeIdFromUrl(url: string): string | null {
  if (!url) return null

  try {
    // Handle youtube.com/watch?v=ID format
    const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (match1?.[1]) return match1[1]

    // Handle youtube.com/watch?v=ID&... format with additional params
    const match2 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
    if (match2?.[1]) return match2[1]

    // Handle youtu.be/ID format
    const match3 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (match3?.[1]) return match3[1]

    // Handle youtube.com/embed/ID format
    const match4 = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (match4?.[1]) return match4[1]
  } catch (error) {
    console.error('Error extracting YouTube ID:', error)
  }

  return null
}

// Sanity field component for auto-extracting YouTube ID
export function YouTubeUrlInput(props: any) {
  const { value, onChange } = props
  const [localValue, setLocalValue] = useState(value || '')

  useEffect(() => {
    // Auto-extract ID when URL changes
    if (localValue && localValue !== value) {
      const extracted = extractYouTubeIdFromUrl(localValue)
      if (extracted) {
        // Update the URL field
        onChange(localValue)
        // Set the ID field (this will be handled by the parent form)
        const event = new CustomEvent('youtubeIdExtracted', { 
          detail: { youtubeId: extracted } 
        })
        document.dispatchEvent(event)
      }
    }
  }, [localValue, value, onChange])

  return (
    <input
      type="url"
      value={localValue}
      onChange={(e) => {
        const url = e.target.value
        setLocalValue(url)
        onChange(url)
      }}
      placeholder="Paste YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
      style={{
        width: '100%',
        padding: '0.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        fontFamily: 'monospace',
      }}
    />
  )
}
