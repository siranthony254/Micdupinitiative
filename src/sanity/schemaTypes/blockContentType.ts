import {defineType, defineArrayMember, Rule} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    // Custom paragraph block with enhanced styling
    defineArrayMember({
      type: 'object',
      title: 'Paragraph',
      name: 'paragraph',
      icon: ImageIcon,
      fields: [
        {
          name: 'content',
          type: 'text',
          title: 'Paragraph Content',
          description: 'The text content of the paragraph',
          validation: Rule => Rule.required().min(1),
        },
        {
          name: 'style',
          type: 'string',
          title: 'Paragraph Style',
          description: 'Visual style for the paragraph',
          options: [
            {title: 'Normal', value: 'normal'},
            {title: 'Lead', value: 'lead'},
            {title: 'Large', value: 'large'},
            {title: 'Small', value: 'small'},
            {title: 'Muted', value: 'muted'},
            {title: 'Highlight', value: 'highlight'},
          ],
          initialValue: 'normal',
        },
        {
          name: 'alignment',
          type: 'string',
          title: 'Text Alignment',
          options: [
            {title: 'Left', value: 'left'},
            {title: 'Center', value: 'center'},
            {title: 'Right', value: 'right'},
            {title: 'Justify', value: 'justify'},
          ],
          initialValue: 'left',
        },
        {
          name: 'backgroundColor',
          type: 'string',
          title: 'Background Color',
          description: 'Background color for the paragraph',
          options: [
            {title: 'Default', value: ''},
            {title: 'Primary', value: 'primary'},
            {title: 'Secondary', value: 'secondary'},
            {title: 'Accent', value: 'accent'},
            {title: 'Muted', value: 'muted'},
            {title: 'Success', value: 'success'},
            {title: 'Warning', value: 'warning'},
            {title: 'Error', value: 'error'},
          ],
          initialValue: '',
        },
        {
          name: 'textColor',
          type: 'string',
          title: 'Text Color',
          description: 'Text color for the paragraph',
          options: [
            {title: 'Default', value: ''},
            {title: 'Primary', value: 'primary'},
            {title: 'Secondary', value: 'secondary'},
            {title: 'Accent', value: 'accent'},
            {title: 'Muted', value: 'muted'},
            {title: 'Success', value: 'success'},
            {title: 'Warning', value: 'warning'},
            {title: 'Error', value: 'error'},
          ],
          initialValue: '',
        },
        {
          name: 'marginBottom',
          type: 'string',
          title: 'Bottom Margin',
          description: 'Spacing below the paragraph',
          options: [
            {title: 'None', value: 'none'},
            {title: 'Small', value: 'small'},
            {title: 'Medium', value: 'medium'},
            {title: 'Large', value: 'large'},
            {title: 'Extra Large', value: 'xlarge'},
          ],
          initialValue: 'medium',
        },
        {
          name: 'dropCap',
          type: 'boolean',
          title: 'Drop Cap',
          description: 'Add a large first letter to the paragraph',
          initialValue: false,
        },
      ],
      preview: {
        select: {
          content: 'content',
          style: 'style',
        },
        prepare(selection) {
          const {content, style} = selection
          return {
            title: style === 'normal' ? 'Paragraph' : `Paragraph (${style})`,
            subtitle: content?.substring(0, 50) + (content?.length > 50 ? '...' : ''),
          }
        },
      },
    }),
  ],
})
