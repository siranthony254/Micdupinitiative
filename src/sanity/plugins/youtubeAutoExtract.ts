import { definePlugin } from 'sanity'

type VideoCommit = {
  patches: Array<{
    set?: {
      youtubeEmbed?: unknown
      youtubeId?: string
    }
  }>
}

type VideoCommitContext = {
  schemaType: {
    name: string
  }
  document?: {
    youtubeEmbed?: unknown
  }
}

// Extract YouTube ID from URL or iframe
function extractYouTubeId(input: string): string | null {
  if (!input) return null
  try {
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
  } catch (error) {
    console.error('Error extracting YouTube ID:', error)
  }
  return null
}

/**
 * Plugin that auto-extracts YouTube ID from youtubeEmbed field
 * Runs when a video document is saved
 */
export const youtubeAutoExtractPlugin = definePlugin(() => {
  return {
    document: {
      // Hook into the prepare phase before the document is saved
      async beforeCommit(commit: VideoCommit, context: VideoCommitContext) {
        if (context.schemaType.name === 'video') {
          const doc = commit.patches[0]?.set || {}
          const youtubeEmbed = doc.youtubeEmbed || context.document?.youtubeEmbed
          
          if (typeof youtubeEmbed === 'string') {
            const extractedId = extractYouTubeId(youtubeEmbed)
            if (extractedId) {
              commit.patches.push({
                set: {
                  youtubeId: extractedId,
                },
              })
            }
          }
        }
        return commit
      },
    },
  }
})
