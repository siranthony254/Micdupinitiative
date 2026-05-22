import { defineField, defineType } from 'sanity'

// Helper to extract YouTube ID from URL
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (match?.[1]) return match[1]
  const match2 = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
  if (match2?.[1]) return match2[1]
  return null
}

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().min(10).max(500),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Video URL',
      type: 'url',
      description: 'Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ). The video ID will be extracted automatically.',
      validation: Rule => Rule.required().custom(value => {
        if (value && !value.includes('youtube.com') && !value.includes('youtu.be')) {
          return 'Please provide a valid YouTube URL'
        }
        return true
      }),
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'Auto-generated from YouTube URL - do not edit',
      readOnly: true,
      validation: Rule => Rule.required().custom(function(value, context) {
        const youtubeUrl = (context.document as any)?.youtubeUrl
        if (!youtubeUrl) {
          return 'YouTube URL is required'
        }
        const extracted = extractYouTubeId(youtubeUrl)
        if (!extracted) {
          return 'Could not extract YouTube ID from URL. Make sure the URL is valid.'
        }
        return true
      }),
    }),
    defineField({
      name: 'type',
      title: 'Video Type',
      type: 'string',
      options: {
        list: [
          { title: 'Podcast', value: 'podcast' },
          { title: 'Talk', value: 'talk' },
          { title: 'Documentary', value: 'documentary' },
          { title: 'Interview', value: 'interview' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Event', value: 'event' },
        ]
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Faith & Spiritual Growth', value: 'Faith & Spiritual Growth' },
          { title: 'Personal Growth', value: 'Personal Growth' },
          { title: 'Purpose & Meaning', value: 'Purpose & Meaning' },
          { title: 'Student Life', value: 'Student Life' },
          { title: 'Academic', value: 'Academic' },
          { title: 'Leadership', value: 'Leadership' },
          { title: 'Campus Culture', value: 'Campus Culture' },
          { title: 'Mentorship', value: 'Mentorship' },
          { title: 'Social Impact', value: 'Social Impact' },
        ]
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'campus',
      title: 'Campus',
      type: 'string',
      description: 'Campus where the video was recorded or is relevant to',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Duration in format "XX min" or "XX:XX" (e.g., "12 min" or "1:23:45")',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show in featured sections and hero areas',
      initialValue: false,
    }),
    defineField({
      name: 'showInRail',
      title: 'Show in Rail',
      type: 'boolean',
      description: 'Include in homepage playlist rail',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'datetime',
      description: 'Hide video after this date (optional)',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Manual ordering - lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      youtubeId: 'youtubeId',
    },
    prepare(selection) {
      const { title, subtitle, youtubeId } = selection
      return {
        title: title || 'Untitled Video',
        subtitle: subtitle || 'No type selected',
        media: youtubeId ? 
          `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : 
          undefined,
      }
    },
  },
})
