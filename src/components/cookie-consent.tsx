"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('mui-cookie-consent')
    if (!consent) {
      setIsVisible(true)
    } else {
      setHasConsented(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('mui-cookie-consent', 'accepted')
    setIsVisible(false)
    setHasConsented(true)
  }

  const declineCookies = () => {
    localStorage.setItem('mui-cookie-consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible || hasConsented) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-amber-800/50 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              <span className="text-amber-400 font-semibold">Cookie Notice:</span> We use cookies to enhance your experience, 
              maintain your login sessions, and improve our platform. By continuing to use MUI Website, 
              you agree to our use of cookies.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="/privacy" className="text-xs text-amber-400 hover:text-amber-300 underline">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="text-xs text-amber-400 hover:text-amber-300 underline">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 transition"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
