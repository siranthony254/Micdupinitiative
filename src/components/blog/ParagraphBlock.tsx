import React from 'react'
import { cn } from '@/lib/utils'

interface ParagraphBlockProps {
  content: string
  style?: 'normal' | 'lead' | 'large' | 'small' | 'muted' | 'highlight'
  alignment?: 'left' | 'center' | 'right' | 'justify'
  backgroundColor?: '' | 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning' | 'error'
  textColor?: '' | 'primary' | 'secondary' | 'accent' | 'muted' | 'success' | 'warning' | 'error'
  marginBottom?: 'none' | 'small' | 'medium' | 'large' | 'xlarge'
  dropCap?: boolean
}

export function ParagraphBlock({
  content,
  style = 'normal',
  alignment = 'left',
  backgroundColor = '',
  textColor = '',
  marginBottom = 'medium',
  dropCap = false,
}: ParagraphBlockProps) {
  // Base classes
  const baseClasses = 'relative leading-relaxed transition-all duration-200'
  
  // Style classes
  const styleClasses = {
    normal: 'text-base',
    lead: 'text-lg md:text-xl font-light',
    large: 'text-2xl md:text-3xl font-semibold',
    small: 'text-sm',
    muted: 'text-gray-400',
    highlight: 'bg-amber-100 text-amber-900 px-2 py-1 rounded',
  }
  
  // Alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }
  
  // Background color classes
  const bgClasses = {
    '': '',
    primary: 'bg-blue-100',
    secondary: 'bg-gray-100',
    accent: 'bg-purple-100',
    muted: 'bg-gray-50',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
  }
  
  // Text color classes
  const textClasses = {
    '': '',
    primary: 'text-blue-900',
    secondary: 'text-gray-900',
    accent: 'text-purple-900',
    muted: 'text-gray-600',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    error: 'text-red-900',
  }
  
  // Margin classes
  const marginClasses = {
    none: '',
    small: 'mb-2',
    medium: 'mb-4',
    large: 'mb-6',
    xlarge: 'mb-8',
  }

  const classes = cn(
    baseClasses,
    styleClasses[style],
    alignmentClasses[alignment],
    bgClasses[backgroundColor],
    textClasses[textColor],
    marginClasses[marginBottom],
    // Add padding for background colors
    backgroundColor && 'px-4 py-3 rounded-lg',
    // Add dark mode support
    'dark:text-white dark:bg-gray-800'
  )

  // Split content for drop cap
  if (dropCap && content.length > 0) {
    const firstLetter = content[0]
    const restOfContent = content.slice(1)
    
    return (
      <p className={classes}>
        <span className="float-left text-6xl md:text-8xl font-bold mr-2 mt-1 text-amber-500 dark:text-amber-400 leading-none">
          {firstLetter}
        </span>
        <span className="inline-block">{restOfContent}</span>
      </p>
    )
  }

  return <p className={classes}>{content}</p>
}

export default ParagraphBlock
