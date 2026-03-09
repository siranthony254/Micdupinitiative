"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPageContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user is admin by email or name
  const checkIfAdmin = (userEmail: string | undefined, userName: string | undefined) => {
    if (!userEmail) return false
    
    // Check admin emails from environment
    const adminEmails = [
      process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      process.env.ADMIN_EMAIL
    ].filter(Boolean)
    
    if (adminEmails.includes(userEmail)) return true
    
    // Check admin names from environment
    const adminNames = [
      process.env.ADMIN_NAME
    ].filter(Boolean)
    
    if (userName && adminNames.includes(userName)) return true
    
    return false
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log('Attempting login for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        throw error
      }

      console.log('Login successful, user:', data.user?.email)
      console.log('Session:', data.session)

      // Check if user is admin for auto-redirect
      const isAdmin = checkIfAdmin(data.user?.email, data.user?.user_metadata?.full_name)
      console.log('Admin check result:', { email: data.user?.email, isAdmin })

      // Determine redirect target
      let redirectTo = searchParams.get("redirect")
      
      // Auto-redirect admins to admin dashboard if no specific redirect
      if (!redirectTo && isAdmin) {
        redirectTo = "/mui-portal/admin"
        console.log('Auto-redirecting admin to dashboard')
      } else if (!redirectTo) {
        redirectTo = "/mui-portal/dashboard"
      }

      console.log('Redirecting to:', redirectTo)
      
      // Small delay to ensure auth state is set
      setTimeout(() => {
        router.push(redirectTo)
      }, 500)
      
    } catch (error: any) {
      console.error('Login failed:', error)
      setError(error.message || "Login failed. Please try again.")
      setLoading(false) // Only set loading to false on error
    }
  }

  const message = searchParams.get("message")

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-500">
            Welcome to MUI Portal
          </h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg text-black bg-amber-500 hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/mui-portal/signup"
              className="text-amber-500 hover:text-amber-400"
            >
              Sign up
            </Link>
          </p>

          {message && (
            <p className="mt-4 text-green-400 text-sm">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}