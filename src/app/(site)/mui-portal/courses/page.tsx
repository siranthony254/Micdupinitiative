"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  lessons?: Lesson[]
}

interface Lesson {
  id: string
  title: string
  completed: boolean
}

export default function CoursesPage() {
  const { user, loading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<Record<string, Lesson[]>>({})
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchCourses()
      fetchUserProgress()
    }
  }, [user])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (error) return
      setCourses(data || [])
    } catch (error) {
      // Silent error handling
    }
  }

  const fetchUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select(`
          lesson_id,
          completed,
          lesson:lessons (
            id,
            title
          )
        `)
        .eq('user_id', user!.id)

      if (error) return

      // Group progress by course
      const progressByCourse: Record<string, Lesson[]> = {}
      data?.forEach((item: any) => {
        if (!progressByCourse[item.lesson.id]) {
          progressByCourse[item.lesson.id] = []
        }
        progressByCourse[item.lesson.id].push({
          id: item.lesson_id,
          title: item.lesson.title,
          completed: item.completed
        })
      })

      setUserProgress(progressByCourse)
    } catch (error) {
      // Silent error handling
    } finally {
      setDataLoading(false)
    }
  }

  const getCourseProgress = (course: Course) => {
    if (!course.lessons || course.lessons.length === 0) return 0
    
    const completedLessons = course.lessons.filter(lesson => 
      userProgress[lesson.id]?.some(l => l.completed) || false
    ).length
    
    return Math.round((completedLessons / course.lessons.length) * 100)
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">Please sign in to access courses.</p>
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
          <h1 className="text-3xl font-bold text-amber-500 mb-2">Courses</h1>
          <p className="text-gray-400">Explore our self-paced courses and track your learning progress</p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-amber-500 mb-2">No Courses Available</h3>
              <p className="text-gray-400">Check back later for new courses.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = getCourseProgress(course)
              return (
                <Link
                  key={course.id}
                  href={`/mui-portal/courses/${course.id}`}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-amber-500 transition group"
                >
                  {/* Course Thumbnail */}
                  <div className="relative h-48 bg-gray-800">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-amber-500 text-2xl font-bold">
                            {course.title.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Progress Badge */}
                    {progress > 0 && (
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full">
                        <span className="text-amber-500 text-sm font-medium">
                          {progress}% Complete
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-amber-500 mb-2 group-hover:text-amber-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{course.lessons?.length || 0} lessons</span>
                        <span>
                          {course.lessons?.filter(lesson => 
                            userProgress[lesson.id]?.some(l => l.completed) || false
                          ).length || 0} completed
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
