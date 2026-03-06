"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProgressBar } from '@/components/progress-bar'

interface Lesson {
  id: string
  title: string
  content: string
  order_index: number
  completed: boolean
}

interface Cohort {
  id: string
  name: string
  description: string
  member_count: number
}

interface CohortLesson {
  lesson: Lesson
  order_index: number
}

export default function CohortPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [cohort, setCohort] = useState<Cohort | null>(null)
  const [lessons, setLessons] = useState<CohortLesson[]>([])
  const [progress, setProgress] = useState(0)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user && params.id) {
      fetchCohort()
    }
  }, [user, params.id])

  const fetchCohort = async () => {
    try {
      setDataLoading(true)

      // Check if user is enrolled
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user!.id)
        .eq('cohort_id', params.id)
        .single()

      setIsEnrolled(!!enrollment)

      // Fetch cohort details
      const { data: cohortData, error: cohortError } = await supabase
        .from('cohorts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (cohortError) throw cohortError

      // Get member count
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('cohort_id', params.id)

      setCohort({
        ...cohortData,
        member_count: count || 0
      })

      // Fetch cohort lessons if enrolled
      if (enrollment) {
        const { data: cohortLessons } = await supabase
          .from('cohort_lessons')
          .select(`
            order_index,
            lesson:lessons (
              id,
              title,
              content
            )
          `)
          .eq('cohort_id', params.id)
          .order('order_index')

        // Fetch user progress for lessons
        const { data: progressData } = await supabase
          .from('progress')
          .select('lesson_id, completed')
          .eq('user_id', user!.id)
          .eq('completed', true)

        // Merge progress with lessons
        const lessonsWithProgress = (cohortLessons || []).map((cl: any) => ({
          order_index: cl.order_index,
          lesson: {
            ...cl.lesson,
            completed: progressData?.some(p => p.lesson_id === cl.lesson.id) || false
          }
        }))

        setLessons(lessonsWithProgress)

        // Calculate progress
        const completedCount = lessonsWithProgress.filter((l: CohortLesson) => l.lesson.completed).length
        const progressPercentage = lessonsWithProgress.length > 0 
          ? Math.round((completedCount / lessonsWithProgress.length) * 100)
          : 0
        setProgress(progressPercentage)
      }

    } catch (error) {
      console.error('Error fetching cohort:', error)
      router.push('/mui-portal/cohorts')
    } finally {
      setDataLoading(false)
    }
  }

  const toggleLessonComplete = async (lessonId: string, completed: boolean) => {
    if (!user) return

    try {
      if (completed) {
        // Remove progress
        await supabase
          .from('progress')
          .delete()
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
      } else {
        // Add progress
        await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
          })
      }

      // Refresh cohort data
      await fetchCohort()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading cohort...</p>
        </div>
      </div>
    )
  }

  if (!user || !cohort) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Cohort Not Found</h1>
          <p className="mt-2 text-gray-400">This cohort doesn't exist or you don't have access.</p>
          <Link href="/mui-portal/cohorts" className="mt-4 inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition">
            Back to Cohorts
          </Link>
        </div>
      </div>
    )
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-amber-500 mb-4">{cohort.name}</h1>
          <p className="text-gray-400 mb-6">{cohort.description}</p>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-300 mb-4">You need to enroll in this cohort to access its content.</p>
            <p className="text-sm text-gray-500 mb-4">Members: {cohort.member_count}</p>
            <Link 
              href="/mui-portal/cohorts"
              className="inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
            >
              Join Cohort
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/mui-portal/cohorts"
            className="text-amber-500 hover:text-amber-400 transition mb-4 inline-block"
          >
            ← Back to Cohorts
          </Link>
          <h1 className="text-3xl font-bold text-amber-500 mb-2">{cohort.name}</h1>
          <p className="text-gray-400 mb-4">{cohort.description}</p>
          
          {/* Progress Overview */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Cohort Progress</span>
              <span className="text-sm font-medium text-amber-500">{progress}%</span>
            </div>
            <ProgressBar progress={progress} size="md" />
            <p className="text-xs text-gray-500 mt-2">
              {lessons.filter(l => l.lesson.completed).length} of {lessons.length} lessons completed
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {cohort.member_count} members enrolled
            </p>
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Cohort Lessons</h2>
          
          {lessons.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No lessons available for this cohort yet.</p>
            </div>
          ) : (
            lessons
              .sort((a, b) => a.order_index - b.order_index)
              .map((cohortLesson) => (
                <div key={cohortLesson.lesson.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-amber-500 mb-2">
                        {cohortLesson.order_index + 1}. {cohortLesson.lesson.title}
                      </h3>
                      {cohortLesson.lesson.content && (
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300">{cohortLesson.lesson.content}</p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleLessonComplete(cohortLesson.lesson.id, cohortLesson.lesson.completed)}
                      className={`ml-4 px-4 py-2 rounded-lg transition ${
                        cohortLesson.lesson.completed
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {cohortLesson.lesson.completed ? '✓ Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
