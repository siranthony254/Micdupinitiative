"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalCohorts: number
  totalEnrollments: number
  recentUsers: Array<{
    full_name: string | null
    email: string | null
    created_at: string
  }>
  recentCompletions: Array<{
    completed_at: string
    user: {
      full_name: string
    }[]
    lesson: {
      title: string
      course: {
        title: string
      }[]
    }[]
  }>
}

interface UserProfile {
  full_name: string | null
  email: string | null
  created_at: string
}

interface Course {
  title: string
}

interface ProfileCount {
  count: number
}

export default function AdminDashboard() {
  const { user, profile, isAdmin, loading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalCohorts: 0,
    totalEnrollments: 0,
    recentUsers: [],
    recentCompletions: [],
  })

  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    console.log('Admin dashboard effect:', { 
      user: user?.email, 
      profile, 
      isAdmin, 
      loading,
      userExists: !!user,
      profileExists: !!profile 
    })
    
    // Redirect if not authenticated or not admin
    if (!loading && (!isAdmin || !user)) {
      console.log('Redirecting to dashboard - not admin or no user')
      router.push("/mui-portal/dashboard")
      return
    }

    // Only fetch stats if we have a confirmed admin user
    if (isAdmin && user && profile) {
      console.log('Fetching admin dashboard stats for:', user.email)
      fetchDashboardStats()
    } else {
      console.log('Not fetching admin stats - admin:', isAdmin, 'user:', !!user, 'profile:', !!profile)
    }
  }, [isAdmin, user, loading, profile, router])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)
      console.log('Fetching admin dashboard stats...')

      // Fetch stats with error handling for missing tables
      let totalUsers = 0
      let totalCourses = 0
      let totalCohorts = 0
      let totalEnrollments = 0
      let recentUsers: DashboardStats['recentUsers'] = []
      let recentCompletions: DashboardStats['recentCompletions'] = []

      try {
        const result = await supabase.from("profiles").select("*", { count: "exact", head: true })
        if (result.data && typeof result.data === 'object' && 'count' in result.data) {
          totalUsers = (result.data as ProfileCount).count ?? 0
        }
      } catch (error) {
        console.log('Profiles table not found or error:', error)
      }

      try {
        const result = await supabase.from("courses").select("*", { count: "exact", head: true })
        if (result.data && typeof result.data === 'object' && 'count' in result.data) {
          totalCourses = (result.data as ProfileCount).count ?? 0
        }
      } catch (error) {
        console.log('Courses table not found or error:', error)
      }

      try {
        const result = await supabase.from("cohorts").select("*", { count: "exact", head: true })
        if (result.data && typeof result.data === 'object' && 'count' in result.data) {
          totalCohorts = (result.data as ProfileCount).count ?? 0
        }
      } catch (error) {
        console.log('Cohorts table not found or error:', error)
      }

      try {
        const result = await supabase.from("enrollments").select("*", { count: "exact", head: true })
        if (result.data && typeof result.data === 'object' && 'count' in result.data) {
          totalEnrollments = (result.data as ProfileCount).count ?? 0
        }
      } catch (error) {
        console.log('Enrollments table not found or error:', error)
      }

      try {
        const result = await supabase
          .from("profiles")
          .select("full_name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(5)
        if (result.data) {
          recentUsers = result.data as UserProfile[]
        }
      } catch (error) {
        console.log('Recent users query error:', error)
      }

      try {
        const result = await supabase
          .from("progress")
          .select(`
            completed_at,
            user:profiles (full_name),
            lesson:lessons (
              title,
              course:courses (title)
            )
          `)
          .eq("completed", true)
          .order("completed_at", { ascending: false })
          .limit(5)
        if (result.data) {
          recentCompletions = result.data as DashboardStats['recentCompletions']
        }
      } catch (error) {
        console.log('Recent completions query error:', error)
      }

      console.log('Admin stats fetched:', {
        totalUsers,
        totalCourses,
        totalCohorts,
        totalEnrollments,
        recentUsersCount: recentUsers.length,
        recentCompletionsCount: recentCompletions.length
      })

      setStats({
        totalUsers,
        totalCourses,
        totalCohorts,
        totalEnrollments,
        recentUsers: recentUsers || [],
        recentCompletions: recentCompletions || [],
      })
    } catch (error) {
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalCohorts: 0,
        totalEnrollments: 0,
        recentUsers: [],
        recentCompletions: [],
      })
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">Admin access required.</p>
          <Link
            href="/mui-portal/dashboard"
            className="mt-4 inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
          >
            Back to Dashboard
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
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage courses, cohorts, and users
          </p>
          
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs text-gray-500">
              Debug Admin Status: {isAdmin ? '✅ Yes' : '❌ No'} | User: {user?.email} | Profile: {profile?.full_name} | Role: {profile?.role} | Blog Role: {profile?.blog_role}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} subtitle="Registered users" />
          <StatCard title="Courses" value={stats.totalCourses} subtitle="Available courses" />
          <StatCard title="Cohorts" value={stats.totalCohorts} subtitle="Active cohorts" />
          <StatCard title="Enrollments" value={stats.totalEnrollments} subtitle="Total enrollments" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AdminCard
            title="Manage Courses"
            description="Create courses with rich content sections"
            icon="📚"
            action={() => router.push('/mui-portal/admin/courses-enhanced')}
          />
        
          <AdminCard
            title="Manage Cohorts"
            description="Create cohorts with rich content sections"
            icon="👥"
            action={() => router.push('/mui-portal/admin/cohorts-enhanced')}
          />
        
          <AdminCard
            title="Classic Course Management"
            description="Basic course management (legacy)"
            icon="📖"
            action={() => router.push('/mui-portal/admin/courses')}
          />
        
          <AdminCard
            title="Classic Cohort Management"
            description="Basic cohort management (legacy)"
            icon="🔄"
            action={() => router.push('/mui-portal/admin/cohorts')}
          />

        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Users */}
          <ActivityCard title="Recent Users">
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-400">No recent users</p>
            ) : (
              stats.recentUsers.map((user, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">{user.full_name || "Unknown"}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </ActivityCard>

          {/* Recent Completions */}
          <ActivityCard title="Recent Lesson Completions">
            {stats.recentCompletions.length === 0 ? (
              <p className="text-gray-400">No recent completions</p>
            ) : (
              stats.recentCompletions.map((completion: any, i) => (
                <div key={i} className="py-2 border-b border-gray-800">
                  <p className="text-white font-medium">
                    {completion.lesson?.title || "Unknown Lesson"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    by {completion.user?.full_name || "Unknown User"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(completion.completed_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </ActivityCard>

        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-amber-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  )
}

function AdminCard({ title, description, icon, action }: any) {
  return (
    <div 
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition cursor-pointer group"
      onClick={action}
    >
      <div className="text-center">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400">
          {title}
        </h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  )
}

function AdminLink({ href, title, desc }: any) {
  return (
    <Link
      href={href}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
    >
      <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
        {title}
      </h3>
      <p className="text-gray-400">{desc}</p>
    </Link>
  )
}

function ActivityCard({ title, children }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-amber-500 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}