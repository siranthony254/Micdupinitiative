"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: 'student' | 'admin'
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Auto-detect admin by email
  const isAdmin = profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || profile?.role === 'admin'

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      // Don't fetch profile immediately - let user get to dashboard first
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', { event, session })
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('User logged in:', session.user.email)
          // Create minimal profile for navigation
          const minimalProfile: Profile = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email || 'User',
            email: session.user.email || null,
            role: 'student',
            created_at: new Date().toISOString(),
          }
          setProfile(minimalProfile)
        } else {
          console.log('User logged out')
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
