import { defineField, defineType } from 'sanity'
import { extractYouTubeId, extractYouTubeIdFromIframe, getYouTubeThumbnailUrl } from '@/lib/youtube'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'youtubeEmbed',
      title: 'YouTube Embed Code',
      type: 'text',
      description: 'Paste the YouTube iframe embed code (e.g., <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"...></iframe>)',
      validation: Rule =>
        Rule.required().custom(value => {
          if (!value) return true
          const id = extractYouTubeId(value) || extractYouTubeIdFromIframe(value)
          return id ? true : 'Paste a valid YouTube iframe embed code or YouTube link.'
        }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional. Used as the card/player title. Leave blank to use a default title.',
      validation: Rule => Rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(500),
    }),
    defineField({
      name: 'type',
      title: 'Section',
      type: 'string',
      initialValue: 'talk',
      options: {
        layout: 'radio',
        list: [
          { title: 'Podcast', value: 'podcast' },
          { title: 'Talk', value: 'talk' },
          { title: 'Documentary', value: 'documentary' },
          { title: 'Interview', value: 'interview' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Event', value: 'event' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'campus',
      title: 'Campus',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Optional, for example 12 min or 1:23:45.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show in featured sections and hero areas.',
      initialValue: false,
    }),
    defineField({
      name: 'showInRail',
      title: 'Show on Homepage Rail',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Optional. Lower numbers appear first.',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      youtubeEmbed: 'youtubeEmbed',
    },
    prepare(selection) {
      const youtubeId = extractYouTubeId(selection.youtubeEmbed) || extractYouTubeIdFromIframe(selection.youtubeEmbed)

      return {
        title: selection.title || 'YouTube video',
        subtitle: selection.subtitle || 'Video',
        media: youtubeId ? getYouTubeThumbnailUrl(youtubeId) : undefined,
      }
    },
  },
})
