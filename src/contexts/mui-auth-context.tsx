"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/lib/mui-portal'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = profile?.role === 'admin'

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createProfile(userId)
        } else {
          // Other error - don't get stuck, just continue without profile
          console.error('Profile fetch failed, continuing without profile:', error.message)
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      // Don't get stuck on error, continue without profile
    }
  }

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        // Auto-detect admin by email domain or specific emails
        const adminEmails = ['admin@muiportal.com', 'admin@example.com', 'micdup@campus.edu', 'officialsiranthony@gmail.com']
        const isAdmin = adminEmails.includes(userData.user.email || '') || 
                       userData.user.email?.endsWith('@admin.muiportal.com') ||
                       userData.user.email?.endsWith('@micdupinitiative.org')

        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0],
            email: userData.user.email,
            role: isAdmin ? 'admin' : 'student'
          })
          .select()
          .single()

        if (!error) {
          setProfile(data)
        } else {
          console.error('Profile creation failed:', error.message)
        }
      }
    } catch (error) {
      console.error('Profile creation error:', error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Auto-redirect based on user role
      if (data.user) {
        await fetchProfile(data.user.id)
        
        // Short delay to ensure profile is loaded
        setTimeout(() => {
          if (profile?.role === 'admin') {
            window.location.href = '/mui-portal/admin'
          } else {
            window.location.href = '/mui-portal/dashboard'
          }
        }, 1000)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout - setting loading to false')
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
        
        setLoading(false)
        clearTimeout(loadingTimeout)
      } catch (error) {
        console.error('Session fetch error:', error)
        setLoading(false)
        clearTimeout(loadingTimeout)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
          
          setLoading(false)
          clearTimeout(loadingTimeout)
        } catch (error) {
          console.error('Auth state change error:', error)
          setLoading(false)
          clearTimeout(loadingTimeout)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(loadingTimeout)
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
