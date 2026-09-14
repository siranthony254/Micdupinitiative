// Hand-rolled validation mirroring the constraints already declared in the
// Sanity schemas (src/sanity/schemaTypes/*.ts) - no new dependency needed
// for checks this simple.

const UPDATE_TYPES = [
  'podcast', 'blog', 'event', 'tour', 'general', 'announcement', 'partnership', 'mentorship',
] as const

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function validatePost(input: any): string[] {
  const errors: string[] = []
  if (!isNonEmptyString(input?.title)) errors.push('Title is required.')
  if (!isNonEmptyString(input?.slug)) errors.push('Slug is required.')
  if (!isNonEmptyString(input?.authorId)) errors.push('An author is required.')
  if (!Array.isArray(input?.body) || input.body.length === 0) errors.push('Body cannot be empty.')
  return errors
}

export function validateUpdate(input: any): string[] {
  const errors: string[] = []
  const title = input?.title
  const description = input?.description

  if (!isNonEmptyString(title) || title.trim().length < 10 || title.trim().length > 100) {
    errors.push('Title must be between 10 and 100 characters.')
  }
  if (!isNonEmptyString(description) || description.trim().length < 20 || description.trim().length > 300) {
    errors.push('Description must be between 20 and 300 characters.')
  }
  if (!Array.isArray(input?.content) || input.content.length === 0) {
    errors.push('Content cannot be empty.')
  }
  if (!UPDATE_TYPES.includes(input?.type)) {
    errors.push(`Type must be one of: ${UPDATE_TYPES.join(', ')}.`)
  }
  return errors
}

export function validateCategory(input: any): string[] {
  const errors: string[] = []
  if (!isNonEmptyString(input?.title)) errors.push('Title is required.')
  if (!isNonEmptyString(input?.slug)) errors.push('Slug is required.')
  return errors
}

export function validateAuthor(input: any): string[] {
  const errors: string[] = []
  if (!isNonEmptyString(input?.name)) errors.push('Name is required.')
  if (!isNonEmptyString(input?.slug)) errors.push('Slug is required.')
  return errors
}

/** Turns "My Title!" into "my-title" - used to auto-derive slugs client-side. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/**
 * authorType.bio uses a deliberately restricted Portable Text shape (Normal
 * style only, no lists, default marks) - simple enough that a plain
 * textarea (one paragraph per line) round-trips correctly without a full
 * PortableTextEditor instance.
 */
export function bioToPlainText(bio: any[] | undefined): string {
  if (!Array.isArray(bio)) return ''
  return bio
    .map((block) =>
      Array.isArray(block?.children)
        ? block.children.map((child: any) => child?.text ?? '').join('')
        : ''
    )
    .join('\n')
}

export function plainTextToBio(text: string): any[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => ({
      _type: 'block',
      _key: `block-${Math.random().toString(36).slice(2, 10)}`,
      style: 'normal',
      children: [{ _type: 'span', _key: `span-${Math.random().toString(36).slice(2, 10)}`, text: line, marks: [] }],
    }))
}
