"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: 'student' | 'admin'
  created_at: string
  blog_role?: 'author' | 'editor' | 'admin'
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  profileLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  sessionTimeout: number | null
  showSessionWarning: boolean
  extendSession: () => void
  endSession: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState<number | null>(null)
  const [showSessionWarning, setShowSessionWarning] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Session timeout duration (20 minutes in milliseconds)
  const SESSION_TIMEOUT_DURATION = 20 * 60 * 1000
  const WARNING_TIME = 2 * 60 * 1000 // Show warning 2 minutes before timeout

  // Session management functions
  const startSessionTimer = useCallback(() => {
    if (!session) return
    
    const now = Date.now()
    // Use session start time from localStorage or current time as fallback
    const sessionStart = localStorage.getItem('mui-session-start') || now.toString()
    const sessionAge = now - parseInt(sessionStart)
    const remainingTime = SESSION_TIMEOUT_DURATION - sessionAge
    
    if (remainingTime <= WARNING_TIME) {
      setShowSessionWarning(true)
      setSessionTimeout(remainingTime)
    } else {
      setShowSessionWarning(false)
      setSessionTimeout(remainingTime)
    }
    
    // Store remaining time for cross-tab sync
    localStorage.setItem('mui-session-remaining', remainingTime.toString())
  }, [session])

  const extendSession = useCallback(() => {
    setShowSessionWarning(false)
    setSessionTimeout(SESSION_TIMEOUT_DURATION)
    // Update session start time to extend
    localStorage.setItem('mui-session-start', Date.now().toString())
    localStorage.setItem('mui-session-extended', 'true')
  }, [])

  const endSession = useCallback(async () => {
    console.log('Ending session due to timeout')
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
    setShowSessionWarning(false)
    setSessionTimeout(null)
    // Clear any stored session
    localStorage.removeItem('mui-session-start')
    localStorage.removeItem('mui-session-extended')
    localStorage.removeItem('mui-session-remaining')
  }, [])

  // Auto-detect admin by email, name, or role
  const isAdmin = useMemo(() => {
    if (!profile) return false
    
    // Check main admin role
    if (profile.role === 'admin') return true
    
    // Check admin email from environment
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    if (adminEmail && profile.email === adminEmail) return true
    
    // Check admin name from environment
    const adminName = process.env.ADMIN_NAME
    if (adminName && profile.full_name === adminName) return true
    
    // Check multiple admin emails if configured
    const adminEmails = [
      process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      process.env.ADMIN_EMAIL
    ].filter(Boolean)
    
    if (profile.email && adminEmails.includes(profile.email)) return true
    
    // Check blog admin role
    if (profile.blog_role === 'admin') return true
    
    return false
  }, [profile])

  const fetchProfile = async (userId: string) => {
    if (profileLoading) return // Prevent multiple simultaneous calls
    
    console.log('Fetching profile for user:', userId)
    setProfileLoading(true)
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
    )
    
    try {
      // Get user data first to have fallback information
      const { data: userData } = await supabase.auth.getUser()
      const userMetadata = userData?.user?.user_metadata || {}
      
      // Try to fetch from main profiles table first
      let data = null
      let error = null
      
      try {
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        const result = await Promise.race([profilePromise, timeoutPromise]) as any
        data = result.data
        error = result.error

        console.log('Main profile query result:', { data, error })
      } catch (tableError) {
        console.log('Main profiles table error:', tableError)
        error = tableError
      }

      // If main profiles table doesn't exist or fails, try blog_profiles
      if (error && (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist'))) {
        console.log('Main profiles table not found, trying blog_profiles')
        
        try {
          const blogProfilePromise = supabase
            .from('blog_profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

          const blogResult = await Promise.race([blogProfilePromise, timeoutPromise]) as any
          data = blogResult.data
          error = blogResult.error
          
          console.log('Blog profile query result:', { data, error })
          
          // Convert blog profile to main profile format
          if (data) {
            data = {
              id: data.id,
              full_name: data.full_name,
              email: userData?.user?.email || null, // Use auth email for blog profiles
              role: data.role === 'admin' ? 'admin' : 'student',
              created_at: data.created_at,
              blog_role: data.role
            }
          }
        } catch (blogError) {
          console.log('Blog profiles table error:', blogError)
          error = blogError
        }
      }

      // If we still have an error, create a fallback profile
      if (error || !data) {
        console.log('Creating fallback profile due to error or missing data')
        
        const fallbackProfile: Profile = {
          id: userId,
          full_name: userMetadata.full_name || userData?.user?.email || 'User',
          email: userData?.user?.email || null,
          role: 'student',
          created_at: new Date().toISOString()
        }
        
        // Try to create the profile in the appropriate table
        try {
          // First try main profiles table
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(fallbackProfile)
            .select()
            .single()

          if (insertError && (insertError.code === 'PGRST116' || insertError.message?.includes('relation'))) {
            console.log('Main profiles table not found, creating blog profile instead')
            
            // Create blog profile instead
            const blogProfile = {
              id: userId,
              full_name: fallbackProfile.full_name,
              bio: null,
              role: 'author' as const
            }
            
            const { error: blogInsertError } = await supabase
              .from('blog_profiles')
              .insert(blogProfile)

            if (blogInsertError) {
              console.log('Blog profile creation failed, using local fallback')
            } else {
              console.log('Blog profile created successfully')
            }
            
            // Set profile with blog_role
            setProfile({
              ...fallbackProfile,
              blog_role: 'author'
            })
          } else if (insertError) {
            console.log('Profile creation failed, using local fallback')
            setProfile(fallbackProfile)
          } else {
            console.log('Profile created successfully')
            setProfile(fallbackProfile)
          }
        } catch (insertError) {
          console.log('Profile creation exception, using local fallback')
          setProfile(fallbackProfile)
        }
        return
      }

      // Profile found, set it
      setProfile(data)
      
      // Also check for blog profile to get blog role
      try {
        const { data: blogData, error: blogError } = await supabase
          .from('blog_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (!blogError && blogData) {
          // Update main profile with blog role if different
          if (data && data.role !== blogData.role) {
            setProfile(prev => prev ? ({
              ...prev,
              blog_role: blogData.role
            }) : null)
          }
        }
      } catch (blogError) {
        console.log('Blog profile check failed:', blogError)
        // Continue without blog profile
      }
      
    } catch (error) {
      console.log('Profile fetch failed, creating minimal fallback')
      
      // Get user data for fallback
      const { data: userData } = await supabase.auth.getUser()
      const userMetadata = userData?.user?.user_metadata || {}
      
      // Set minimal profile to prevent hanging
      const fallbackProfile: Profile = {
        id: userId,
        full_name: userMetadata.full_name || userData?.user?.email || 'User',
        email: userData?.user?.email || null,
        role: 'student',
        created_at: new Date().toISOString()
      }
      
      setProfile(fallbackProfile)
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
          // Don't wait for profile - set loading to false immediately
          setLoading(false)
          fetchProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Initial session error:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mui-session-remaining') {
        const remainingTime = parseInt(e.newValue || '0')
        setSessionTimeout(remainingTime)
        
        if (remainingTime <= WARNING_TIME) {
          setShowSessionWarning(true)
        } else {
          setShowSessionWarning(false)
        }
      }
      
      if (e.key === 'mui-session-extended') {
        if (e.newValue === 'true') {
          setShowSessionWarning(false)
          setSessionTimeout(SESSION_TIMEOUT_DURATION)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setSession(session)
          setMounted(true)
          // Store session start time
          localStorage.setItem('mui-session-start', Date.now().toString())
          localStorage.setItem('mui-session-remaining', SESSION_TIMEOUT_DURATION.toString())
          // Set loading to false immediately, fetch profile in background
          setLoading(false)
          fetchProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setSession(null)
          setShowSessionWarning(false)
          setSessionTimeout(null)
          // Clear session data
          localStorage.removeItem('mui-session-start')
          localStorage.removeItem('mui-session-extended')
          localStorage.removeItem('mui-session-remaining')
          setLoading(false)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user)
          setSession(session)
          setMounted(true)
          fetchProfile(session.user.id)
        }
      }
    )

    // Set up session timeout timer
    let timer: NodeJS.Timeout | null = null
    
    const updateTimer = () => {
      if (timer) clearInterval(timer)
      
      if (session) {
        timer = setInterval(() => {
          const now = Date.now()
          const sessionStart = localStorage.getItem('mui-session-start')
          if (sessionStart) {
            const sessionAge = now - parseInt(sessionStart)
            const remainingTime = SESSION_TIMEOUT_DURATION - sessionAge
            
            // Update localStorage for cross-tab sync
            localStorage.setItem('mui-session-remaining', remainingTime.toString())
            
            if (remainingTime <= WARNING_TIME) {
              setShowSessionWarning(true)
              setSessionTimeout(remainingTime)
            } else {
              setShowSessionWarning(false)
              setSessionTimeout(remainingTime)
            }
            
            // Auto-end session if timeout reached
            if (remainingTime <= 0) {
              endSession()
            }
          }
        }, 1000) // Check every second
      }
    }
    
    updateTimer()
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      mounted = false
      if (subscription) subscription.unsubscribe()
      if (timer) clearInterval(timer)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { success: false, error: error.message }
      }

      console.log('Sign in successful:', data.user?.email)
      return { success: true }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    profile,
    session,
    loading,
    profileLoading,
    isAdmin,
    signIn,
    signOut,
    refreshProfile,
    sessionTimeout,
    showSessionWarning,
    extendSession,
    endSession
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
