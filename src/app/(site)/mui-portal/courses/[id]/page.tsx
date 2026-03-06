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

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  lessons: Lesson[]
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user && params.id) {
      fetchCourse()
    }
  }, [user, params.id])

  const fetchCourse = async () => {
    try {
      setDataLoading(true)

      // Fetch course with lessons
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          lessons (
            id,
            title,
            content,
            order_index
          )
        `)
        .eq('id', params.id)
        .single()

      if (courseError) throw courseError

      // Fetch user progress for lessons
      const { data: progressData } = await supabase
        .from('progress')
        .select('lesson_id, completed')
        .eq('user_id', user!.id)
        .eq('completed', true)

      // Merge progress with lessons
      const lessonsWithProgress = courseData.lessons.map((lesson: any) => ({
        ...lesson,
        completed: progressData?.some(p => p.lesson_id === lesson.id) || false
      }))

      setCourse({
        ...courseData,
        lessons: lessonsWithProgress
      })

      // Calculate progress
      const completedCount = lessonsWithProgress.filter((l: Lesson) => l.completed).length
      const progressPercentage = lessonsWithProgress.length > 0 
        ? Math.round((completedCount / lessonsWithProgress.length) * 100)
        : 0
      setProgress(progressPercentage)

    } catch (error) {
      console.error('Error fetching course:', error)
      router.push('/mui-portal/courses')
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

      // Refresh course data
      await fetchCourse()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!user || !course) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Course Not Found</h1>
          <p className="mt-2 text-gray-400">This course doesn't exist or you don't have access.</p>
          <Link href="/mui-portal/courses" className="mt-4 inline-block px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition">
            Back to Courses
          </Link>
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
            href="/mui-portal/courses"
            className="text-amber-500 hover:text-amber-400 transition mb-4 inline-block"
          >
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-amber-500 mb-2">{course.title}</h1>
          <p className="text-gray-400 mb-4">{course.description}</p>
          
          {/* Progress Overview */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Course Progress</span>
              <span className="text-sm font-medium text-amber-500">{progress}%</span>
            </div>
            <ProgressBar progress={progress} size="md" />
            <p className="text-xs text-gray-500 mt-2">
              {course.lessons.filter(l => l.completed).length} of {course.lessons.length} lessons completed
            </p>
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Lessons</h2>
          
          {course.lessons.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No lessons available for this course yet.</p>
            </div>
          ) : (
            course.lessons
              .sort((a, b) => a.order_index - b.order_index)
              .map((lesson) => (
                <div key={lesson.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-amber-500 mb-2">
                        {lesson.order_index + 1}. {lesson.title}
                      </h3>
                      {lesson.content && (
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300">{lesson.content}</p>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleLessonComplete(lesson.id, lesson.completed)}
                      className={`ml-4 px-4 py-2 rounded-lg transition ${
                        lesson.completed
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {lesson.completed ? '✓ Completed' : 'Mark Complete'}
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
