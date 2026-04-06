import React from 'react'
import { PortableTextComponents } from '@portabletext/react'
import ParagraphBlock from './ParagraphBlock'

// Custom components for Portable Text rendering
export const customComponents: Partial<PortableTextComponents> = {
  // Block styles (correct structure)
  block: {
    // Normal paragraph with proper spacing
    normal: ({ children }) => (
      <p className="mb-6 leading-7 text-gray-300 dark:text-gray-400">
        {children}
      </p>
    ),
    
    // Lead paragraph for intros
    lead: ({ children }) => (
      <p className="mb-8 text-xl md:text-2xl font-light leading-relaxed text-gray-200 dark:text-gray-300">
        {children}
      </p>
    ),
    
    // Large paragraph for emphasis
    large: ({ children }) => (
      <p className="mb-8 text-2xl md:text-3xl font-semibold leading-tight text-white">
        {children}
      </p>
    ),
    
    // Small paragraph for fine print
    small: ({ children }) => (
      <p className="mb-4 text-sm leading-relaxed text-gray-400 dark:text-gray-500">
        {children}
      </p>
    ),
    
    // Muted paragraph
    muted: ({ children }) => (
      <p className="mb-6 leading-7 text-gray-500 dark:text-gray-600">
        {children}
      </p>
    ),
    
    // Highlight paragraph
    highlight: ({ children }) => (
      <p className="mb-6 px-4 py-3 bg-amber-100 text-amber-900 rounded-lg dark:bg-amber-900/20 dark:text-amber-100">
        {children}
      </p>
    ),
    
    // Enhanced blockquote with styling
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-6 border-l-4 border-amber-500 italic text-gray-300 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/10 py-2">
        {children}
      </blockquote>
    ),
    
    // Enhanced headings with better styling
    h1: ({ children }) => (
      <h1 className="mt-12 mb-6 text-3xl md:text-4xl font-bold text-white leading-tight">
        {children}
      </h1>
    ),
    
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-bold text-white leading-tight">
        {children}
      </h2>
    ),
    
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl md:text-2xl font-semibold text-white leading-tight">
        {children}
      </h3>
    ),
    
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg md:text-xl font-semibold text-white leading-tight">
        {children}
      </h4>
    ),
  },
  
  // Enhanced list styling
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-2 text-gray-300 dark:text-gray-400">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 space-y-2 text-gray-300 dark:text-gray-400">
        {children}
      </ol>
    ),
  },
  
  // Enhanced link styling
  marks: {
    link: ({ children, value }) => (
      <a 
        href={value?.href} 
        className="text-amber-400 hover:text-amber-300 underline transition-colors duration-200"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    
    // Strong/bold text
    strong: ({ children }) => (
      <strong className="font-bold text-white">
        {children}
      </strong>
    ),
    
    // Emphasis/italic text
    em: ({ children }) => (
      <em className="italic text-gray-300 dark:text-gray-400">
        {children}
      </em>
    ),
  },
}

export default customComponents
