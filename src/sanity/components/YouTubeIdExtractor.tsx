import { useEffect, useState } from 'react'

// Extract YouTube ID from various URL formats or iframe
export function extractYouTubeIdFromUrl(input: string): string | null {
  if (!input) return null

  try {
    // Try to extract from iframe src attribute
    const srcMatch = input.match(/src=["']([^"']+)["']/)
    if (srcMatch) {
      const url = srcMatch[1]
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
      if (match?.[1]) return match[1]
    }

    // Handle youtube.com/watch?v=ID format
    const match1 = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (match1?.[1]) return match1[1]

    // Handle youtube.com/watch?v=ID&... format with additional params
    const match2 = input.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
    if (match2?.[1]) return match2[1]

    // Handle youtu.be/ID format
    const match3 = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (match3?.[1]) return match3[1]

    // Handle youtube.com/embed/ID format
    const match4 = input.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (match4?.[1]) return match4[1]
  } catch (error) {
    console.error('Error extracting YouTube ID:', error)
  }

  return null
}

// Sanity field component for auto-extracting YouTube ID
export function YouTubeEmbedInput(props: any) {
  const { value, onChange } = props
  const [localValue, setLocalValue] = useState(value || '')

  useEffect(() => {
    // Auto-extract ID when embed code changes
    if (localValue && localValue !== value) {
      const extracted = extractYouTubeIdFromUrl(localValue)
      if (extracted) {
        // Update the embed field
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
    <textarea
      value={localValue}
      onChange={(e) => {
        const embed = e.target.value
        setLocalValue(embed)
        onChange(embed)
      }}
      placeholder="Paste YouTube iframe embed code (e.g., &lt;iframe src=&quot;https://www.youtube-nocookie.com/embed/VIDEO_ID&quot;...&gt;&lt;/iframe&gt;)"
      style={{
        width: '100%',
        padding: '0.5rem',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        fontFamily: 'monospace',
        minHeight: '80px',
      }}
    />
  )
}
