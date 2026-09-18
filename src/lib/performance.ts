// Performance optimization utilities

// Image optimization utilities
export function getOptimizedImageProps(src: string, width: number, height: number, priority: boolean = false) {
  return {
    src,
    width,
    height,
    loading: 'lazy' as const,
    priority,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    className: 'object-cover transition-transform duration-300 group-hover:scale-105'
  }
}
