import { definePlugin } from 'sanity'

type VideoCommit = {
  patches: Array<{
    set?: {
      youtubeUrl?: unknown
      youtubeId?: string
    }
  }>
}

type VideoCommitContext = {
  schemaType: {
    name: string
  }
  document?: {
    youtubeUrl?: unknown
  }
}

// Extract YouTube ID from URL
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  try {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (match?.[1]) return match[1]
    const match2 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
    if (match2?.[1]) return match2[1]
  } catch (error) {
    console.error('Error extracting YouTube ID:', error)
  }
  return null
}

/**
 * Plugin that auto-extracts YouTube ID from youtubeUrl field
 * Runs when a video document is saved
 */
export const youtubeAutoExtractPlugin = definePlugin(() => {
  return {
    document: {
      // Hook into the prepare phase before the document is saved
      async beforeCommit(commit: VideoCommit, context: VideoCommitContext) {
        if (context.schemaType.name === 'video') {
          const doc = commit.patches[0]?.set || {}
          const youtubeUrl = doc.youtubeUrl || context.document?.youtubeUrl
          
          if (typeof youtubeUrl === 'string') {
            const extractedId = extractYouTubeId(youtubeUrl)
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
