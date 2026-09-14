"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Input, Alert } from '@/components/ui'
import { slugify, bioToPlainText, plainTextToBio } from '@/lib/admin-validation'
import { ImageUploadField, type SanityImageValue } from './ImageUploadField'

interface AuthorFormValue {
  _id?: string
  name: string
  slug: string
  image: SanityImageValue | null
  bio: any[]
}

export function AuthorForm({ initialValue }: { initialValue?: AuthorFormValue }) {
  const router = useRouter()
  const isEditing = Boolean(initialValue?._id)

  const [name, setName] = useState(initialValue?.name ?? '')
  const [slug, setSlug] = useState(initialValue?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [image, setImage] = useState<SanityImageValue | null>(initialValue?.image ?? null)
  const [bioText, setBioText] = useState(bioToPlainText(initialValue?.bio))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const url = isEditing ? `/api/admin/authors/${initialValue!._id}` : '/api/admin/authors'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, image, bio: plainTextToBio(bioText) }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Save failed')
      setSaving(false)
      return
    }

    router.push('/admin/authors')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialValue?._id) return
    if (!window.confirm('Delete this author?')) return

    await fetch(`/api/admin/authors/${initialValue._id}`, { method: 'DELETE' })
    router.push('/admin/authors')
    router.refresh()
  }

  return (
    <Card className="max-w-xl">
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={name} onChange={handleNameChange} required />
        <Input label="Slug" value={slug} onChange={(v) => { setSlug(v); setSlugTouched(true) }} required />

        <ImageUploadField label="Photo" value={image} onChange={setImage} />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Bio (one paragraph per line)</label>
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            style={{ backgroundColor: '#374151' }}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={saving}>
            {isEditing ? 'Save Changes' : 'Create Author'}
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
