import { defineField, defineType } from 'sanity'
import { blockContentType } from './blockContentType'

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
      description: 'Duration in format "XX min" or "XX:XX"',
      validation: Rule => Rule.required().regex(/^\d{1,3}(\.\d{1,2})?\s(min|hr)$/),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'primaryPlatform',
      title: 'Primary Platform',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Self-hosted', value: 'self-hosted' },
        ]
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'YouTube video ID (the part after v= in YouTube URLs)',
      hidden: ({ document }) => (document as any)?.primaryPlatform !== 'youtube',
      validation: Rule => Rule.custom(value => {
        if ((document as any)?.primaryPlatform === 'youtube' && !value) {
          return 'YouTube ID is required when primary platform is YouTube'
        }
        return true
      }),
    }),
    defineField({
      name: 'vimeoId',
      title: 'Vimeo Video ID',
      type: 'string',
      description: 'Vimeo video ID',
      hidden: ({ document }) => (document as any)?.primaryPlatform !== 'vimeo',
      validation: Rule => Rule.custom(value => {
        if ((document as any)?.primaryPlatform === 'vimeo' && !value) {
          return 'Vimeo ID is required when primary platform is Vimeo'
        }
        return true
      }),
    }),
    defineField({
      name: 'selfHostedUrl',
      title: 'Self-hosted URL',
      type: 'url',
      description: 'URL for self-hosted video files',
      hidden: ({ document }) => (document as any)?.primaryPlatform !== 'self-hosted',
      validation: Rule => Rule.custom(value => {
        if ((document as any)?.primaryPlatform === 'self-hosted' && !value) {
          return 'URL is required when primary platform is self-hosted'
        }
        return true
      }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'External platform URL (YouTube, Vimeo, etc.)',
    }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
      ],
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
      name: 'comingSoon',
      title: 'Coming Soon',
      type: 'boolean',
      description: 'Mark as coming soon (will show placeholder)',
      initialValue: false,
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
      description: 'Manual ordering override',
      initialValue: 0,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Additional content, transcript, or show notes',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for categorization and search',
    }),
    defineField({
      name: 'guests',
      title: 'Guests/Speakers',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of guests or speakers in the video',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      thumbnail: 'thumbnail',
    },
    prepare(selection) {
      const { title, subtitle, thumbnail } = selection
      return {
        title: title || 'Untitled Video',
        subtitle: subtitle || 'No subtitle',
        media: thumbnail,
      }
    },
  },
})
