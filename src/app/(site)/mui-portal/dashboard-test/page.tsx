"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function TestDashboardPage() {
  const { user, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    if (user) {
      setDebugInfo(`Welcome! User: ${user.email}, ID: ${user.id}`)
    } else {
      setDebugInfo('No user found')
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">Please sign in to access your dashboard.</p>
          <Link href="/mui-portal/login-test" className="mt-4 inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-500 mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email || 'User'}!
          </h1>
          <p className="text-gray-400">
            Test Dashboard - Debug Version
          </p>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Debug Information</h2>
          <div className="space-y-2">
            <p className="text-gray-300">
              <strong>User ID:</strong> {user.id}
            </p>
            <p className="text-gray-300">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-300">
              <strong>Full Name:</strong> {user.user_metadata?.full_name || 'Not set'}
            </p>
            <p className="text-gray-300">
              <strong>Status:</strong> {debugInfo}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            href="/mui-portal/courses"
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
          >
            <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
              Browse Courses
            </h3>
            <p className="text-gray-400">Explore self-paced courses and track your progress</p>
          </Link>

          <Link 
            href="/mui-portal/cohorts"
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
          >
            <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
              Join Cohorts
            </h3>
            <p className="text-gray-400">Enter secret keys to join exclusive cohort programs</p>
          </Link>
        </div>

        {/* Test Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Test Navigation</h2>
          <div className="space-y-4">
            <Link href="/mui-portal/login-test" className="text-amber-500 hover:text-amber-400 underline">
              → Test Login
            </Link>
            <br />
            <Link href="/mui-portal/login" className="text-amber-500 hover:text-amber-400 underline">
              → Normal Login
            </Link>
            <br />
            <Link href="/mui-portal/dashboard" className="text-amber-500 hover:text-amber-400 underline">
              → Normal Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
