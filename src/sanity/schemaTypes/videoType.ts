import { defineField, defineType } from 'sanity'
import { extractYouTubeId, getYouTubeThumbnailUrl } from '@/lib/youtube'

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Link',
      type: 'url',
      description: 'Paste a YouTube watch, share, shorts, live, or embed link.',
      validation: Rule =>
        Rule.required().custom(value => {
          if (!value) return true
          return extractYouTubeId(value) ? true : 'Paste a valid YouTube link.'
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
      youtubeUrl: 'youtubeUrl',
    },
    prepare(selection) {
      const youtubeId = extractYouTubeId(selection.youtubeUrl)

      return {
        title: selection.title || 'YouTube video',
        subtitle: selection.subtitle || 'Video',
        media: youtubeId ? getYouTubeThumbnailUrl(youtubeId) : undefined,
      }
    },
  },
})
