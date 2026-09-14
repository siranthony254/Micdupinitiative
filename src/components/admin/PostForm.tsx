"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PortableTextBlock } from '@portabletext/editor'
import { Card, Button, Input, Alert } from '@/components/ui'
import { slugify } from '@/lib/admin-validation'
import { ImageUploadField, type SanityImageValue } from './ImageUploadField'
import { PortableTextEditor } from './PortableTextEditor'

interface PostFormValue {
  _id?: string
  title: string
  slug: string
  authorId: string
  categoryIds: string[]
  mainImage: SanityImageValue | null
  publishedAt: string
  body: PortableTextBlock[]
}

interface PostFormProps {
  initialValue?: PostFormValue
  authors: Array<{ _id: string; name: string }>
  categories: Array<{ _id: string; title: string }>
}

export function PostForm({ initialValue, authors, categories }: PostFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialValue?._id)

  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [slug, setSlug] = useState(initialValue?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [authorId, setAuthorId] = useState(initialValue?.authorId ?? authors[0]?._id ?? '')
  const [categoryIds, setCategoryIds] = useState<string[]>(initialValue?.categoryIds ?? [])
  const [mainImage, setMainImage] = useState<SanityImageValue | null>(initialValue?.mainImage ?? null)
  const [publishedAt, setPublishedAt] = useState(
    initialValue?.publishedAt ? initialValue.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [body, setBody] = useState<PortableTextBlock[]>(initialValue?.body ?? [])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const url = isEditing ? `/api/admin/posts/${initialValue!._id}` : '/api/admin/posts'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        slug,
        authorId,
        categoryIds,
        mainImage,
        publishedAt: new Date(publishedAt).toISOString(),
        body,
      }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Save failed')
      setSaving(false)
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialValue?._id) return
    if (!window.confirm('Delete this post?')) return

    await fetch(`/api/admin/posts/${initialValue._id}`, { method: 'DELETE' })
    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <Card className="max-w-3xl">
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Title" value={title} onChange={handleTitleChange} required />
        <Input label="Slug" value={slug} onChange={(v) => { setSlug(v); setSlugTouched(true) }} required />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Author</label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
            className="w-full rounded-md border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            style={{ backgroundColor: '#374151' }}
          >
            <option value="" disabled>Select an author…</option>
            {authors.map((a) => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>
          {authors.length === 0 && (
            <p className="mt-1 text-xs text-amber-500">No authors yet — create one first.</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Categories</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <label key={c._id} className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={categoryIds.includes(c._id)}
                  onChange={() => toggleCategory(c._id)}
                  className="rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500"
                />
                {c.title}
              </label>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="mt-1 text-xs text-amber-500">No categories yet — create one first.</p>
          )}
        </div>

        <ImageUploadField label="Cover Image" value={mainImage} onChange={setMainImage} />

        <Input
          label="Published Date"
          type="date"
          value={publishedAt}
          onChange={setPublishedAt}
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Body</label>
          <PortableTextEditor value={body} onChange={setBody} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {isEditing ? 'Save Changes' : 'Publish Post'}
          </Button>
          {isEditing && (
            <button type="button" onClick={handleDelete} className="text-sm text-red-400 hover:text-red-300">
              Delete
            </button>
          )}
        </div>
      </form>
    </Card>
  )
}
