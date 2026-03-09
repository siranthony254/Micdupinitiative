"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

export default function SessionTimeoutWarning() {
  const { sessionTimeout, showSessionWarning, extendSession, endSession } = useAuth()
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (sessionTimeout !== null) {
      setTimeLeft(Math.ceil(sessionTimeout / 1000))
    }
  }, [sessionTimeout])

  useEffect(() => {
    const timer = setInterval(() => {
      if (sessionTimeout !== null && sessionTimeout > 0) {
        setTimeLeft(prev => Math.max(0, prev - 1))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionTimeout])

  if (!showSessionWarning) return null

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0-6l-3-3m6 0v6m0 6v-6m0 6l-3-3m-3 3m6 0v6m0 6v-6m0 6l-3-3" />
          </svg>
          <span className="text-sm font-medium">Session Timeout</span>
        </div>
        <div className="text-sm">
          {timeLeft > 60 ? (
            <span>{Math.floor(timeLeft / 60)} minutes remaining</span>
          ) : (
            <span>{formatTime(timeLeft)} remaining</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={extendSession}
          className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
        >
          Extend Session
        </button>
        <button
          onClick={endSession}
          className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
