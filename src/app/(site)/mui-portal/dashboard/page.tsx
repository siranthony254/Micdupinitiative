"use client"

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ProgressBar } from '@/components/progress-bar'

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

  console.log('Dashboard state:', { user: user?.email, profile, loading, dataLoading })

  const getFirstName = (fullName: string | null) => {
    if (!fullName) return 'User'
    return fullName.split(' ')[0]
  }

  const fetchUserData = useCallback(async () => {
    if (!user) return
    console.log('Fetching dashboard data for user:', user.id)
    try {
      setDataLoading(true)

      // Fetch enrollments with cohort details
      console.log('Fetching enrollments...')
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
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

      if (enrollmentsError) {
        console.error('Enrollments error:', enrollmentsError)
      } else {
        console.log('Enrollments fetched:', enrollmentsData?.length || 0)
      }

      // Fetch all courses
      console.log('Fetching courses...')
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')

      if (coursesError) {
        console.error('Courses error:', coursesError)
      } else {
        console.log('Courses fetched:', coursesData?.length || 0)
      }

      // Format enrollments
      if (enrollmentsData) {
        const formattedEnrollments = enrollmentsData.map((enrollment: any) => ({
          cohort: {
            id: enrollment.cohorts.id,
            name: enrollment.cohorts.name,
            description: enrollment.cohorts.description
          },
          enrolled_at: enrollment.enrolled_at
        }))
        setEnrollments(formattedEnrollments)
      }
      
      if (coursesData) setCourses(coursesData)

      // Calculate overall progress based on actual course progress
      let totalProgress = 0
      let courseCount = 0
      
      if (coursesData && coursesData.length > 0) {
        for (const course of coursesData) {
          const { data: courseProgress } = await supabase
            .rpc('calculate_course_progress', { 
              user_uuid: user!.id, 
              course_uuid: course.id 
            })
          
          if (courseProgress !== null) {
            totalProgress += courseProgress
            courseCount++
          }
        }
      }
      
      const progressPercentage = courseCount > 0 ? Math.round(totalProgress / courseCount) : 0
      setOverallProgress(progressPercentage)
      console.log('Overall progress calculated:', progressPercentage)
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
    } finally {
      setDataLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    // Initial load
    fetchUserData()

    // Real-time updates for this user’s dashboard
    const channel = supabase
      .channel(`dashboard-realtime-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'enrollments',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('Realtime update: enrollments changed')
          fetchUserData()
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses',
        },
        () => {
          console.log('Realtime update: courses changed')
          fetchUserData()
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('Realtime update: progress changed')
          fetchUserData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchUserData])

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
            <ProgressBar progress={overallProgress} size="md" />
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
