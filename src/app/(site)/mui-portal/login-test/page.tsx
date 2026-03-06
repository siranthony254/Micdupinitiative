"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDebugInfo('')

    try {
      console.log('🔑 Starting login for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📥 Login response:', { data, error })

      if (error) {
        console.error('❌ Login error:', error)
        throw error
      }

      console.log('✅ Login successful, redirecting...')
      setDebugInfo(`Success! User: ${data.user?.email}, ID: ${data.user?.id}`)
      
      // Add small delay to ensure session is set
      setTimeout(() => {
        router.push('/mui-portal/dashboard')
      }, 500)
      
    } catch (error: any) {
      console.error('❌ Catch error:', error)
      setError(error.message)
      setDebugInfo(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-500">Test Login</h2>
          <p className="mt-2 text-gray-400">Debug version - check console</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {debugInfo && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
              {debugInfo}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            <Link href="/mui-portal/login" className="text-amber-500 hover:text-amber-400">
              Back to normal login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
