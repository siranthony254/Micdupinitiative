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

  const fetchProfile = async (userId: string, userEmail?: string, fullName?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      const shouldBeAdmin = userEmail === adminEmail

      if (!data) {
        // Create profile if none exists
        const newProfile = {
          id: userId,
          full_name: fullName || userEmail || 'User',
          email: userEmail || null,
          role: shouldBeAdmin ? 'admin' : 'student',
          created_at: new Date().toISOString(),
        }

        const { data: createdProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        if (insertError) {
          console.error('Error creating profile:', insertError)
          setProfile(newProfile as Profile)
        } else {
          setProfile(createdProfile as Profile)
        }
        return
      }

      // Auto-promote to admin if email matches and not already admin
      if (shouldBeAdmin && data.role !== 'admin') {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId)
          .select()
          .single()
        
        if (!updateError && updatedProfile) {
          setProfile(updatedProfile as Profile)
        } else {
          setProfile({ ...data, role: 'admin' } as Profile)
        }
      } else {
        setProfile(data as Profile)
      }
    } catch (error) {
      // Silent error handling
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata?.full_name)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata?.full_name
        )
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
          await fetchProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata?.full_name
          )
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
