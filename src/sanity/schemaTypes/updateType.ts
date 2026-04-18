import {BellIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const updateType = defineType({
  name: 'update',
  title: 'Update',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      rows: 3,
      validation: (Rule) => Rule.required().min(20).max(300),
    }),
    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Update Type',
      options: {
        list: [
          {title: 'Podcast Episode', value: 'podcast'},
          {title: 'Blog Post', value: 'blog'},
          {title: 'Event', value: 'event'},
          {title: 'Campus Tour', value: 'tour'},
          {title: 'General Update', value: 'general'},
          {title: 'Announcement', value: 'announcement'},
          {title: 'Partnership', value: 'partnership'},
          {title: 'Mentorship', value: 'mentorship'},
        ],
      },
      initialValue: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'link',
      type: 'url',
      title: 'Link',
      description: 'Optional link for more information (e.g., event page, blog post, etc.)',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
      description: 'Show this update in featured section',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'Order in which this update appears (lower numbers appear first)',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'expiryDate',
      type: 'datetime',
      title: 'Expiry Date',
      description: 'When this update should no longer be shown (optional)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      featured: 'featured',
      image: 'image',
    },
    prepare(selection) {
      const {type, featured} = selection
      return {
        ...selection,
        subtitle: `${type}${featured ? ' (Featured)' : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Type, Order',
      name: 'typeOrder',
      by: [
        {field: 'type', direction: 'asc'},
        {field: 'order', direction: 'asc'},
        {field: 'publishedAt', direction: 'desc'},
      ],
    },
    {
      title: 'Order',
      name: 'order',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Published At',
      name: 'publishedAt',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
