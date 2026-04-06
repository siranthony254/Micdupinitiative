import React from 'react'
import { PortableTextComponents } from '@portabletext/react'
import ParagraphBlock from './ParagraphBlock'

// Custom components for Portable Text rendering
export const customComponents: Partial<PortableTextComponents> = {
  // Custom paragraph block renderer
  paragraph: ({ value }) => {
    if (!value) return null
    
    return (
      <ParagraphBlock
        content={value.content}
        style={value.style}
        alignment={value.alignment}
        backgroundColor={value.backgroundColor}
        textColor={value.textColor}
        marginBottom={value.marginBottom}
        dropCap={value.dropCap}
      />
    )
  },
  
  // Enhanced blockquote with styling
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-amber-500 pl-4 py-2 my-4 bg-amber-50 dark:bg-amber-900/20 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  ),
  
  // Enhanced headings with better styling
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
      {children}
    </h1>
  ),
  
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
      {children}
    </h2>
  ),
  
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
      {children}
    </h3>
  ),
  
  h4: ({ children }) => (
    <h4 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
      {children}
    </h4>
  ),
  
  // Enhanced list styling
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 dark:text-gray-400">
      {children}
    </ul>
  ),
  
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300 dark:text-gray-400">
      {children}
    </ol>
  ),
  
  li: ({ children }) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
  
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
  },
  
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
}

export default customComponents
