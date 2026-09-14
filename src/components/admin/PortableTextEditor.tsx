"use client"

import { useEffect, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import {
  defineSchema,
  EditorProvider,
  PortableTextEditable,
  useEditor,
  useEditorSelector,
  type PortableTextBlock,
} from '@portabletext/editor'
import { getActiveStyle, getActiveListItem, getValue, getMarkState } from '@portabletext/editor/selectors'
import { urlFor } from '@/sanity/lib/image'
import { ImageUploadField, type SanityImageValue } from './ImageUploadField'

/**
 * Mirrors src/sanity/schemaTypes/blockContentType.ts field-for-field, so
 * output here is structurally identical to what Studio produces - the
 * public site's PortableTextComponents.tsx renders either one the same way.
 */
const schemaDefinition = defineSchema({
  styles: [
    { name: 'normal', title: 'Normal' },
    { name: 'h1', title: 'H1' },
    { name: 'h2', title: 'H2' },
    { name: 'h3', title: 'H3' },
    { name: 'h4', title: 'H4' },
    { name: 'blockquote', title: 'Quote' },
    { name: 'lead', title: 'Lead' },
    { name: 'large', title: 'Large' },
    { name: 'small', title: 'Small' },
    { name: 'muted', title: 'Muted' },
    { name: 'highlight', title: 'Highlight' },
  ],
  lists: [
    { name: 'bullet', title: 'Bullet' },
    { name: 'number', title: 'Numbered' },
  ],
  decorators: [
    { name: 'strong', title: 'Bold' },
    { name: 'em', title: 'Italic' },
  ],
  annotations: [
    { name: 'link', title: 'URL', fields: [{ name: 'href', type: 'string', title: 'URL' }] },
  ],
  blockObjects: [{ name: 'image', title: 'Image' }],
  inlineObjects: [],
})

const STYLE_LABELS: Record<string, string> = {
  normal: 'Normal', h1: 'H1', h2: 'H2', h3: 'H3', h4: 'H4',
  blockquote: 'Quote', lead: 'Lead', large: 'Large', small: 'Small',
  muted: 'Muted', highlight: 'Highlight',
}

interface PortableTextEditorProps {
  value: PortableTextBlock[]
  onChange: (value: PortableTextBlock[]) => void
}

export function PortableTextEditor({ value, onChange }: PortableTextEditorProps) {
  // initialValue is only read once by EditorProvider - later prop changes
  // are ignored by design (this is an uncontrolled-on-mount, then
  // change-driven-out editor, not a fully controlled one).
  const initialValueRef = useRef(value)

  return (
    <EditorProvider
      initialConfig={{
        schemaDefinition,
        initialValue: initialValueRef.current.length ? initialValueRef.current : undefined,
      }}
    >
      <SyncedEditable onChange={onChange} />
    </EditorProvider>
  )
}

function SyncedEditable({ onChange }: { onChange: (value: PortableTextBlock[]) => void }) {
  const editor = useEditor()
  const liveValue = useEditorSelector(editor, getValue)
  const activeStyle = useEditorSelector(editor, getActiveStyle)
  const activeListItem = useEditorSelector(editor, getActiveListItem)
  const markState = useEditorSelector(editor, getMarkState)
  const activeMarks = markState?.marks ?? []

  const lastEmitted = useRef<PortableTextBlock[] | undefined>(undefined)

  useEffect(() => {
    if (liveValue !== lastEmitted.current) {
      lastEmitted.current = liveValue
      onChange(liveValue ?? [])
    }
  }, [liveValue, onChange])

  function handleLink() {
    const href = window.prompt('Link URL (https://…)')
    if (!href) return
    editor.send({ type: 'annotation.toggle', annotation: { name: 'link', value: { href } } })
  }

  async function handleImageFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/assets', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) {
      window.alert(data.error || 'Image upload failed')
      return
    }

    editor.send({
      type: 'insert.blocks',
      blocks: [
        {
          _type: 'image',
          _key: `img-${Date.now()}`,
          asset: { _type: 'reference', _ref: data._id },
          alt: '',
        } as unknown as PortableTextBlock,
      ],
      placement: 'auto',
    })
  }

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-700 bg-gray-800 p-2">
        <ToolbarButton active={activeMarks.includes('strong')} onClick={() => editor.send({ type: 'decorator.toggle', decorator: 'strong' })}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton active={activeMarks.includes('em')} onClick={() => editor.send({ type: 'decorator.toggle', decorator: 'em' })}>
          <em>i</em>
        </ToolbarButton>

        <select
          value={activeStyle || 'normal'}
          onChange={(e) => editor.send({ type: 'style.toggle', style: e.target.value })}
          className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-gray-200"
        >
          {Object.entries(STYLE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        <ToolbarButton active={activeListItem === 'bullet'} onClick={() => editor.send({ type: 'list item.toggle', listItem: 'bullet' })}>
          • List
        </ToolbarButton>
        <ToolbarButton active={activeListItem === 'number'} onClick={() => editor.send({ type: 'list item.toggle', listItem: 'number' })}>
          1. List
        </ToolbarButton>

        <ToolbarButton onClick={handleLink}>Link</ToolbarButton>

        <label className="inline-flex cursor-pointer items-center rounded px-2 py-1 text-sm text-gray-300 hover:bg-gray-700">
          Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageFile(file)
              e.target.value = ''
            }}
          />
        </label>
      </div>

      <PortableTextEditable
        className="min-h-[220px] bg-gray-900 p-4 text-gray-100 focus:outline-none"
        renderStyle={(props) => <StyleTag style={props.value}>{props.children}</StyleTag>}
        renderDecorator={(props) => <DecoratorTag mark={props.value}>{props.children}</DecoratorTag>}
        renderListItem={(props) => <>{props.children}</>}
        renderAnnotation={(props) =>
          props.schemaType.name === 'link' ? (
            <a href={(props.value as { href?: string }).href} className="text-amber-400 underline">
              {props.children}
            </a>
          ) : (
            <>{props.children}</>
          )
        }
        renderBlock={(props) =>
          props.schemaType.name === 'image' ? (
            <ImagePreviewBlock value={props.value} />
          ) : (
            props.children
          )
        }
        renderPlaceholder={() => 'Start writing…'}
      />
    </div>
  )
}

function ToolbarButton({ children, onClick, active }: { children: ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2.5 py-1.5 text-sm transition-colors ${
        active ? 'bg-amber-500 text-black' : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

function StyleTag({ style, children }: { style?: string; children: ReactNode }) {
  switch (style) {
    case 'h1': return <h1 className="text-3xl font-bold mb-2">{children}</h1>
    case 'h2': return <h2 className="text-2xl font-bold mb-2">{children}</h2>
    case 'h3': return <h3 className="text-xl font-semibold mb-2">{children}</h3>
    case 'h4': return <h4 className="text-lg font-semibold mb-2">{children}</h4>
    case 'blockquote': return <blockquote className="border-l-2 border-amber-500 pl-4 italic mb-2">{children}</blockquote>
    case 'lead': return <p className="text-xl font-light mb-2">{children}</p>
    case 'large': return <p className="text-2xl font-semibold mb-2">{children}</p>
    case 'small': return <p className="text-sm mb-2">{children}</p>
    case 'muted': return <p className="text-gray-500 mb-2">{children}</p>
    case 'highlight': return <p className="bg-amber-500/20 px-2 py-1 rounded mb-2">{children}</p>
    default: return <p className="mb-2">{children}</p>
  }
}

function DecoratorTag({ mark, children }: { mark: string; children: ReactNode }) {
  if (mark === 'strong') return <strong>{children}</strong>
  if (mark === 'em') return <em>{children}</em>
  return <>{children}</>
}

function ImagePreviewBlock({ value }: { value: unknown }) {
  const image = value as SanityImageValue
  let previewUrl: string | null = null
  try {
    previewUrl = urlFor(image).width(480).height(270).url()
  } catch {
    previewUrl = null
  }

  return (
    <div className="relative my-3 w-full max-w-sm overflow-hidden rounded-lg border border-gray-700" style={{ aspectRatio: '16/9' }}>
      {previewUrl && <Image src={previewUrl} alt={image?.alt || ''} fill className="object-cover" />}
    </div>
  )
}
