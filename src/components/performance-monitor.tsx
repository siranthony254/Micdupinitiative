"use client"

import { useEffect } from 'react'
import { preloadCriticalAssets, reportWebVitals } from '@/lib/performance'

export function PerformanceMonitor() {
  useEffect(() => {
    preloadCriticalAssets()

    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals)
      onFCP(reportWebVitals)
      onINP(reportWebVitals)
      onLCP(reportWebVitals)
      onTTFB(reportWebVitals)
    })
  }, [])

  return null
}
