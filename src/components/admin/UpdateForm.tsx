"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PortableTextBlock } from '@portabletext/editor'
import { Card, Button, Input, Alert } from '@/components/ui'
import { ImageUploadField, type SanityImageValue } from './ImageUploadField'
import { PortableTextEditor } from './PortableTextEditor'

const UPDATE_TYPES = [
  'podcast', 'blog', 'event', 'tour', 'general', 'announcement', 'partnership', 'mentorship',
] as const

interface UpdateFormValue {
  _id?: string
  title: string
  description: string
  type: string
  image: SanityImageValue | null
  link: string
  featured: boolean
  order: number
  showInRail: boolean
  publishedAt: string
  expiryDate: string
  content: PortableTextBlock[]
  memoContent: PortableTextBlock[]
  memoSender: string
  memoReference: string
}

export function UpdateForm({ initialValue }: { initialValue?: UpdateFormValue }) {
  const router = useRouter()
  const isEditing = Boolean(initialValue?._id)

  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const [type, setType] = useState(initialValue?.type ?? 'general')
  const [image, setImage] = useState<SanityImageValue | null>(initialValue?.image ?? null)
  const [link, setLink] = useState(initialValue?.link ?? '')
  const [featured, setFeatured] = useState(initialValue?.featured ?? false)
  const [order, setOrder] = useState(String(initialValue?.order ?? 0))
  const [showInRail, setShowInRail] = useState(initialValue?.showInRail ?? false)
  const [publishedAt, setPublishedAt] = useState(
    initialValue?.publishedAt ? initialValue.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [expiryDate, setExpiryDate] = useState(initialValue?.expiryDate ? initialValue.expiryDate.slice(0, 10) : '')
  const [content, setContent] = useState<PortableTextBlock[]>(initialValue?.content ?? [])
  const [memoContent, setMemoContent] = useState<PortableTextBlock[]>(initialValue?.memoContent ?? [])
  const [memoSender, setMemoSender] = useState(initialValue?.memoSender ?? '')
  const [memoReference, setMemoReference] = useState(initialValue?.memoReference ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const url = isEditing ? `/api/admin/updates/${initialValue!._id}` : '/api/admin/updates'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        type,
        image,
        link: link || undefined,
        featured,
        order: Number(order) || 0,
        showInRail,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        content,
        memoContent,
        memoSender: memoSender || undefined,
        memoReference: memoReference || undefined,
      }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Save failed')
      setSaving(false)
      return
    }

    router.push('/admin/updates')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialValue?._id) return
    if (!window.confirm('Delete this update?')) return

    await fetch(`/api/admin/updates/${initialValue._id}`, { method: 'DELETE' })
    router.push('/admin/updates')
    router.refresh()
  }

  return (
    <Card className="max-w-3xl">
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Title (10–100 characters)" value={title} onChange={setTitle} required />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Description (20–300 characters)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="w-full rounded-md border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            style={{ backgroundColor: '#374151' }}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            style={{ backgroundColor: '#374151' }}
          >
            {UPDATE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <ImageUploadField label="Image" value={image} onChange={setImage} />

        <Input label="Link (optional)" value={link} onChange={setLink} placeholder="https://…" />

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={showInRail} onChange={(e) => setShowInRail(e.target.checked)} className="rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-amber-500" />
            Show on homepage rail
          </label>
        </div>

        <Input label="Order (lower shows first)" type="number" value={order} onChange={setOrder} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Published Date" type="date" value={publishedAt} onChange={setPublishedAt} required />
          <Input label="Expiry Date (optional)" type="date" value={expiryDate} onChange={setExpiryDate} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Content</label>
          <PortableTextEditor value={content} onChange={setContent} />
        </div>

        <fieldset className="rounded-lg border border-gray-700 p-4">
          <legend className="px-1 text-sm font-medium text-gray-300">Memo (letterhead popup shown when this rail item is clicked)</legend>
          <div className="space-y-4">
            <Input label="Memo Sender" value={memoSender} onChange={setMemoSender} placeholder="MUI Administration" />
            <Input label="Memo Reference" value={memoReference} onChange={setMemoReference} placeholder="MUI/2026/001" />
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Memo Content</label>
              <PortableTextEditor value={memoContent} onChange={setMemoContent} />
            </div>
          </div>
        </fieldset>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {isEditing ? 'Save Changes' : 'Publish Update'}
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
