"use client"

import { useState, useRef, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  className = "" 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateToolbarState()
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const updateToolbarState = () => {
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsUnderline(document.queryCommandState('underline'))
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      execCommand('insertParagraph')
    }
  }

  return (
    <div className={`border border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              isBold ? 'bg-amber-600 text-black' : 'text-gray-300'
            }`}
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              isItalic ? 'bg-amber-600 text-black' : 'text-gray-300'
            }`}
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              isUnderline ? 'bg-amber-600 text-black' : 'text-gray-300'
            }`}
            title="Underline (Ctrl+U)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
            </svg>
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <select
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm border border-gray-600"
            title="Heading"
          >
            <option value="">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM4 16.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM8.5 4h12v2H8.5V4zm0 6h12v2H8.5v-2zm0 6h12v2H8.5v-2z"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H3v-1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
            </svg>
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-600 pr-2">
          <button
            type="button"
            onClick={() => execCommand('justifyLeft')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 21h18v-2H3v2zm0-4h12v-2H3v2zm0-4h18v-2H3v2zm0-4h12V5H3v2zm0-6h18V2H3v2z"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => execCommand('justifyCenter')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => execCommand('justifyRight')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
            </svg>
          </button>
        </div>

        {/* Other */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => execCommand('undo')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => execCommand('redo')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={updateToolbarState}
        onKeyUp={updateToolbarState}
        className="min-h-[200px] p-4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        style={{ minHeight: '200px' }}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* HTML Preview (for debugging) */}
      <div className="bg-gray-800 border-t border-gray-700 p-2">
        <details className="text-xs text-gray-400">
          <summary>HTML Preview</summary>
          <pre className="mt-2 p-2 bg-gray-900 rounded text-green-400 overflow-x-auto">
            {value || '<empty>'}
          </pre>
        </details>
      </div>
    </div>
  )
}
