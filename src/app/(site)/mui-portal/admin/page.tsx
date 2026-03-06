"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalCohorts: number
  totalEnrollments: number
  recentUsers: any[]
  recentCompletions: any[]
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
    recentCompletions: []
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!isAdmin || !user)) {
      router.push('/mui-portal/dashboard')
      return
    }

    if (isAdmin && user) {
      fetchDashboardStats()
    }
  }, [isAdmin, user, loading, router])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)

      // Fetch total counts with error handling
      const [
        { count: totalUsers },
        { count: totalCourses },
        { count: totalCohorts },
        { count: totalEnrollments }
      ] = await Promise.allSettled([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('cohorts').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true })
      ])

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent lesson completions
      const { data: recentCompletions } = await supabase
        .from('progress')
        .select(`
          completed_at,
          user:profiles (full_name),
          lesson:lessons (title),
          lesson:lessons (course:courses (title))
        `)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(5)

      setStats({
        totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value || 0 : 0,
        totalCourses: totalCourses.status === 'fulfilled' ? totalCourses.value || 0 : 0,
        totalCohorts: totalCohorts.status === 'fulfilled' ? totalCohorts.value || 0 : 0,
        totalEnrollments: totalEnrollments.status === 'fulfilled' ? totalEnrollments.value || 0 : 0,
        recentUsers: recentUsers || [],
        recentCompletions: recentCompletions || []
      })
    } catch (error) {
      // Silent error handling - set default values
      setStats({
        totalUsers: 0,
        totalCourses: 0,
        totalCohorts: 0,
        totalEnrollments: 0,
        recentUsers: [],
        recentCompletions: []
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
          <Link href="/mui-portal/dashboard" className="mt-4 inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition">
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
          <h1 className="text-3xl font-bold text-amber-500 mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage courses, cohorts, and users</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            <p className="text-gray-400 text-sm">Registered users</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Courses</h3>
            <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
            <p className="text-gray-400 text-sm">Available courses</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Cohorts</h3>
            <p className="text-3xl font-bold text-white">{stats.totalCohorts}</p>
            <p className="text-gray-400 text-sm">Active cohorts</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Enrollments</h3>
            <p className="text-3xl font-bold text-white">{stats.totalEnrollments}</p>
            <p className="text-gray-400 text-sm">Total enrollments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/mui-portal/admin/courses"
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
          >
            <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
              Manage Courses
            </h3>
            <p className="text-gray-400">Create, edit, and manage courses</p>
          </Link>

          <Link 
            href="/mui-portal/cohorts"
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
          >
            <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
              Manage Cohorts
            </h3>
            <p className="text-gray-400">Create cohorts and manage enrollments</p>
          </Link>

          <Link 
            href="/mui-portal/admin"
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
          >
            <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
              Manage Users
            </h3>
            <p className="text-gray-400">View and manage user profiles</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-amber-500 mb-4">Recent Users</h3>
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-400">No recent users</p>
            ) : (
              <div className="space-y-3">
                {stats.recentUsers.map((user, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div>
                      <p className="text-white font-medium">{user.full_name || 'Unknown'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <p className="text-gray-500 text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Completions */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-amber-500 mb-4">Recent Lesson Completions</h3>
            {stats.recentCompletions.length === 0 ? (
              <p className="text-gray-400">No recent completions</p>
            ) : (
              <div className="space-y-3">
                {stats.recentCompletions.map((completion: any, index) => (
                  <div key={index} className="py-2 border-b border-gray-800">
                    <p className="text-white font-medium">{completion.lesson?.title || 'Unknown Lesson'}</p>
                    <p className="text-gray-400 text-sm">
                      by {completion.user?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(completion.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
