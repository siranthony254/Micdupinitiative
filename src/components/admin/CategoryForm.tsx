"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Input, Alert } from '@/components/ui'
import { slugify } from '@/lib/admin-validation'

interface CategoryFormValue {
  _id?: string
  title: string
  slug: string
  description: string
}

export function CategoryForm({ initialValue }: { initialValue?: CategoryFormValue }) {
  const router = useRouter()
  const isEditing = Boolean(initialValue?._id)

  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [slug, setSlug] = useState(initialValue?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const url = isEditing ? `/api/admin/categories/${initialValue!._id}` : '/api/admin/categories'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, description }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Save failed')
      setSaving(false)
      return
    }

    router.push('/admin/categories')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialValue?._id) return
    if (!window.confirm('Delete this category?')) return

    await fetch(`/api/admin/categories/${initialValue._id}`, { method: 'DELETE' })
    router.push('/admin/categories')
    router.refresh()
  }

  return (
    <Card className="max-w-xl">
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={handleTitleChange} required />
        <Input
          label="Slug"
          value={slug}
          onChange={(v) => { setSlug(v); setSlugTouched(true) }}
          required
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            style={{ backgroundColor: '#374151' }}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {isEditing ? 'Save Changes' : 'Create Category'}
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
