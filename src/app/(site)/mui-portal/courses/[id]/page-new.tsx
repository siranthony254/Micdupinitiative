"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/mui-auth-context'
import { Card, Button, Badge, ProgressBar } from '@/components/ui'
import { getCourseWithLessons, toggleLessonProgress, calculateProgress } from '@/lib/mui-portal'
import { Course, Lesson } from '@/lib/mui-portal'

export default function CourseDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course & { lessons: Lesson[] } | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const loadCourse = async () => {
    try {
      const courseData = await getCourseWithLessons(courseId)
      setCourse(courseData)
      
      if (user) {
        const progressPercent = await calculateProgress(user.id, courseId)
        setProgress(progressPercent)
      }
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleProgress = async (lessonId: string) => {
    if (!user) {
      router.push('/mui-portal/login')
      return
    }

    try {
      await toggleLessonProgress(user.id, lessonId)
      
      // Reload progress
      const progressPercent = await calculateProgress(user.id, courseId)
      setProgress(progressPercent)
    } catch (error) {
      console.error('Error toggling progress:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Course not found.</p>
        <Link href="/mui-portal/courses" className="text-amber-500 hover:text-amber-400">
          ← Back to Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/mui-portal/courses" className="text-amber-500 hover:text-amber-400 text-sm">
          ← Back to Courses
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4">{course.title}</h1>
        <p className="mt-2 text-gray-400">{course.description}</p>
        
        {/* Progress */}
        <div className="mt-6">
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Lessons */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Lessons</h2>
        <div className="space-y-4">
          {course.lessons.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-400">No lessons available yet.</p>
              </div>
            </Card>
          ) : (
            course.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onToggleProgress={() => handleToggleProgress(lesson.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

interface LessonCardProps {
  lesson: Lesson
  onToggleProgress: () => void
}

function LessonCard({ lesson, onToggleProgress }: LessonCardProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  // In a real app, you'd fetch the user's progress for this lesson
  // For now, we'll just show the lesson content

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
            <div className="mt-3 prose prose-invert max-w-none">
              <div className="text-gray-300">
                {lesson.content ? (
                  <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
                ) : (
                  <p className="text-gray-500">Lesson content coming soon...</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="ml-4">
            <Button
              onClick={onToggleProgress}
              loading={loading}
              variant={isCompleted ? "outline" : "primary"}
              size="sm"
            >
              {isCompleted ? "Completed ✓" : "Mark Complete"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
