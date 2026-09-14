"use client"

import { useRef, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export interface SanityImageValue {
  _type: 'image'
  asset: { _type: 'reference'; _ref: string }
  alt?: string
}

interface ImageUploadFieldProps {
  label?: string
  value: SanityImageValue | null
  onChange: (value: SanityImageValue | null) => void
}

export function ImageUploadField({ label = 'Image', value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/assets', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      onChange({
        _type: 'image',
        asset: { _type: 'reference', _ref: data._id },
        alt: value?.alt || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const previewUrl = value ? urlFor(value).width(320).height(180).url() : null

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {previewUrl && (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-gray-700" style={{ aspectRatio: '16/9' }}>
          <Image src={previewUrl} alt={value?.alt || ''} fill className="object-cover" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-gray-700 file:px-3 file:py-2 file:text-sm file:text-gray-200 hover:file:bg-gray-600"
        />
        {uploading && <span className="text-sm text-amber-500">Uploading…</span>}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        )}
      </div>

      {value && (
        <input
          type="text"
          placeholder="Alt text"
          value={value.alt || ''}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          className="w-full max-w-xs rounded-md border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          style={{ backgroundColor: '#374151' }}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
