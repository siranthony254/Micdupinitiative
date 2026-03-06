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
  const [profileLoading, setProfileLoading] = useState(false)

  // Auto-detect admin by email
  const isAdmin = profile?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || profile?.role === 'admin'

  const fetchProfile = async (userId: string) => {
    if (profileLoading) return // Prevent multiple simultaneous calls
    
    console.log('Fetching profile for user:', userId)
    setProfileLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      console.log('Profile query result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error)
        return
      }

      if (error?.code === 'PGRST116' || !data) {
        // Profile doesn't exist, create one
        console.log('Profile does not exist, creating new one')
        const { data: userData } = await supabase.auth.getUser()
        const userMetadata = userData?.user?.user_metadata || {}
        
        const newProfile = {
          id: userId,
          full_name: userMetadata.full_name || userData?.user?.email || 'User',
          email: userData?.user?.email || null,
          role: 'student'
        }
        
        console.log('Creating profile:', newProfile)
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
        
        if (insertError) {
          console.error('Profile creation error:', insertError)
          // Set temporary profile locally
          setProfile(newProfile as Profile)
          return
        }
        
        console.log('Profile created successfully')
        setProfile(newProfile as Profile)
        return
      }

      // Auto-promote to admin if email matches
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (data.email === adminEmail && data.role !== 'admin') {
        console.log('Promoting user to admin:', data.email)
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId)
        
        if (!updateError) {
          data.role = 'admin'
        }
      }

      console.log('Setting profile:', data)
      setProfile(data as Profile)
    } catch (error) {
      console.error('Profile fetch error:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    let mounted = true
    let authSubscription: any = null

    // Get initial session
    const getInitialSession = async () => {
      if (!mounted) return
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user && mounted) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Initial session error:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return
          
          console.log('Auth state changed:', event, session?.user?.email)
          
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user && mounted) {
            await fetchProfile(session.user.id)
          } else if (mounted) {
            setProfile(null)
          }
          
          if (mounted) {
            setLoading(false)
          }
        }
      )
      
      authSubscription = subscription
      return subscription
    }

    authSubscription = setupAuthListener()

    return () => {
      mounted = false
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
    }
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
