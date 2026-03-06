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
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Auto-detect admin by email
  const isAdmin = profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || profile?.role === 'admin'

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          const defaultProfile: Profile = {
            id: userId,
            full_name: session?.user?.user_metadata?.full_name || session?.user?.email || 'User',
            email: session?.user?.email || null,
            role: 'student',
            created_at: new Date().toISOString(),
          }
          setProfile(defaultProfile)
          return
        }
        return
      }

      if (!data) {
        // Create default profile if none exists
        const defaultProfile: Profile = {
          id: userId,
          full_name: session?.user?.user_metadata?.full_name || session?.user?.email || 'User',
          email: session?.user?.email || null,
          role: 'student',
          created_at: new Date().toISOString(),
        }
        setProfile(defaultProfile)
        return
      }

      // Auto-promote to admin if email matches
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (data.email === adminEmail && data.role !== 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId)
        
        if (!updateError) {
          data.role = 'admin'
        }
      }

      setProfile(data as Profile)
    } catch (error) {
      // Silent error handling
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
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
    refreshProfile,
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
