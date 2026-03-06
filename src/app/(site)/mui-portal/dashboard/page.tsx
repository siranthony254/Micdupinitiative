"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
}

interface Cohort {
  id: string
  name: string
  description: string
}

interface Enrollment {
  cohort: Cohort
  enrolled_at: string
}

export default function DashboardPage() {
  const { user, profile, loading, isAdmin } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)

  const getFirstName = (fullName: string | null) => {
    if (!fullName) return 'User'
    return fullName.split(' ')[0]
  }

  useEffect(() => {
    if (user) {
      fetchUserData()

      // Real-time subscriptions
      const enrollmentsSubscription = supabase
        .channel('enrollments-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'enrollments', filter: `user_id=eq.${user.id}` },
          () => fetchUserData()
        )
        .subscribe()

      const coursesSubscription = supabase
        .channel('courses-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'courses' },
          () => fetchUserData()
        )
        .subscribe()

      return () => {
        supabase.removeChannel(enrollmentsSubscription)
        supabase.removeChannel(coursesSubscription)
      }
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setDataLoading(true)

      // Fetch enrollments with cohort details
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          cohort_id,
          enrolled_at,
          cohorts!inner (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user!.id)

      // Fetch all courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')

      // Format enrollments
      if (enrollmentsData) {
        const formattedEnrollments = enrollmentsData.map((enrollment: any) => ({
          cohort: enrollment.cohorts as Cohort,
          enrolled_at: enrollment.enrolled_at
        }))
        setEnrollments(formattedEnrollments)
      }
      
      if (coursesData) setCourses(coursesData)

      // Calculate overall progress (simplified)
      const progressPercentage = coursesData && coursesData.length > 0 ? 25 : 0
      setOverallProgress(progressPercentage)
    } catch (error) {
      // Silent error handling
    } finally {
      setDataLoading(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">Please sign in to access your dashboard.</p>
          <Link href="/mui-portal/login" className="mt-4 inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition">
            Sign In
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
            Welcome back, {getFirstName(profile.full_name)}!
          </h1>
          <p className="text-gray-400">
            {isAdmin ? 'Administrator' : 'Student'} • Overall Progress: {overallProgress}%
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Overall Progress</h3>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-amber-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm">{overallProgress}% Complete</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Enrolled Cohorts</h3>
            <p className="text-3xl font-bold text-white">{enrollments.length}</p>
            <p className="text-gray-400 text-sm">Active cohorts</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Available Courses</h3>
            <p className="text-3xl font-bold text-white">{courses.length}</p>
            <p className="text-gray-400 text-sm">Self-paced courses</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/mui-portal/courses"
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
          >
            <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
              Browse Courses
            </h3>
            <p className="text-gray-400">Explore self-paced courses and track your progress</p>
          </Link>

          <Link
            href="/mui-portal/cohorts"
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition group"
          >
            <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400">
              Join Cohorts
            </h3>
            <p className="text-gray-400">Enter secret keys to join exclusive cohort programs</p>
          </Link>
        </div>

        {/* Enrolled Cohorts */}
        {enrollments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Your Cohorts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Link 
                  key={enrollment.cohort.id}
                  href={`/mui-portal/cohorts/${enrollment.cohort.id}`}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition"
                >
                  <h3 className="text-lg font-semibold text-amber-500 mb-2">
                    {enrollment.cohort.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{enrollment.cohort.description}</p>
                  <p className="text-gray-500 text-xs">
                    Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Admin Panel</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/mui-portal/admin/courses"
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition"
              >
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Manage Courses</h3>
                <p className="text-gray-400 text-sm">Create and edit courses</p>
              </Link>

              <Link 
                href="/mui-portal/admin/cohorts"
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition"
              >
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Manage Cohorts</h3>
                <p className="text-gray-400 text-sm">Create cohorts and approve enrollments</p>
              </Link>

              <Link 
                href="/mui-portal/admin/users"
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-amber-500 transition"
              >
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Manage Users</h3>
                <p className="text-gray-400 text-sm">View and manage user profiles</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
