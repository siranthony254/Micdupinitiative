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
    recentCompletions: [],
  })

  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!isAdmin || !user)) {
      router.push("/mui-portal/dashboard")
      return
    }

    if (isAdmin && user) {
      fetchDashboardStats()
    }
  }, [isAdmin, user, loading, router])

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true)

      const results = await Promise.allSettled([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("cohorts").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
      ])

      const totalUsers =
        results[0].status === "fulfilled" ? results[0].value.count ?? 0 : 0

      const totalCourses =
        results[1].status === "fulfilled" ? results[1].value.count ?? 0 : 0

      const totalCohorts =
        results[2].status === "fulfilled" ? results[2].value.count ?? 0 : 0

      const totalEnrollments =
        results[3].status === "fulfilled" ? results[3].value.count ?? 0 : 0

      const { data: recentUsers } = await supabase
        .from("profiles")
        .select("full_name, email, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      const { data: recentCompletions } = await supabase
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
          <AdminLink href="/mui-portal/admin/courses" title="Manage Courses" desc="Create, edit, and manage courses" />
          <AdminLink href="/mui-portal/cohorts" title="Manage Cohorts" desc="Create cohorts and manage enrollments" />
          <AdminLink href="/mui-portal/admin" title="Manage Users" desc="View and manage user profiles" />
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