import {HelpCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      title: 'Question',
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: 'answer',
      type: 'blockContent',
      title: 'Answer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          {title: 'General', value: 'general'},
          {title: 'Programs', value: 'programs'},
          {title: 'Membership', value: 'membership'},
          {title: 'Events', value: 'events'},
          {title: 'Partnerships', value: 'partnerships'},
          {title: 'Technical', value: 'technical'},
        ],
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'Order in which this FAQ appears (lower numbers appear first)',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured',
      description: 'Show this FAQ in the featured section',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      featured: 'featured',
    },
    prepare(selection) {
      const {category, featured} = selection
      return {
        ...selection,
        subtitle: `${category}${featured ? ' (Featured)' : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Category, Order',
      name: 'categoryOrder',
      by: [
        {field: 'category', direction: 'asc'},
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
