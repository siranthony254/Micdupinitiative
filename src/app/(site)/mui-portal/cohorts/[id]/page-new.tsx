"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/mui-auth-context'
import { Card, Badge, ProgressBar, Button } from '@/components/ui'
import { getUserEnrollments, calculateProgress } from '@/lib/mui-portal'
import { Enrollment } from '@/lib/mui-portal'

export default function CohortDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const cohortId = params.id as string

  const [enrollment, setEnrollment] = useState<Enrollment & { cohort: any } | null>(null)
  const [progress, setProgress] = useState(0)
  const [memberCount, setMemberCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (cohortId && user) {
      loadCohortData()
    }
  }, [cohortId, user])

  const loadCohortData = async () => {
    if (!user) return

    try {
      // Get user's enrollment for this cohort
      const enrollments = await getUserEnrollments(user.id)
      const userEnrollment = enrollments.find(e => e.cohort_id === cohortId)
      
      if (!userEnrollment) {
        router.push('/mui-portal/cohorts')
        return
      }

      setEnrollment(userEnrollment)

      // Get progress
      const progressPercent = await calculateProgress(user.id, undefined, cohortId)
      setProgress(progressPercent)

      // In a real app, you'd fetch actual member count
      // For now, we'll use a placeholder
      setMemberCount(Math.floor(Math.random() * 50) + 10)
    } catch (error) {
      console.error('Error loading cohort data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">You're not enrolled in this cohort.</p>
        <Link href="/mui-portal/cohorts" className="text-amber-500 hover:text-amber-400">
          ← Back to Cohorts
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/mui-portal/cohorts" className="text-amber-500 hover:text-amber-400 text-sm">
          ← Back to Cohorts
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4">{enrollment.cohort.name}</h1>
        <p className="mt-2 text-gray-400">{enrollment.cohort.description}</p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{memberCount}</div>
              <div className="text-sm text-gray-400">Members</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-400">Progress</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">Active</div>
              <div className="text-sm text-gray-400">Status</div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Lessons Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Cohort Lessons</h2>
          <Badge variant="default">
            {enrollment.cohort.name} – {Math.round(progress)}% Complete
          </Badge>
        </div>
        
        <Card>
          <div className="space-y-4">
            {/* Sample lessons - in a real app, you'd fetch actual cohort lessons */}
            <LessonItem title="Introduction to the Cohort" completed={true} />
            <LessonItem title="Getting Started with Learning Materials" completed={true} />
            <LessonItem title="Core Concepts and Fundamentals" completed={false} />
            <LessonItem title="Practical Applications" completed={false} />
            <LessonItem title="Advanced Topics" completed={false} />
            <LessonItem title="Final Project and Assessment" completed={false} />
          </div>
        </Card>
      </div>

      {/* Members Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Cohort Members</h2>
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-400">{memberCount} active members</p>
            <p className="text-sm text-gray-500 mt-2">
              Connect with your peers and learn together
            </p>
            <Button variant="outline" className="mt-4">
              View Members
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface LessonItemProps {
  title: string
  completed: boolean
}

function LessonItem({ title, completed }: LessonItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-5 h-5 rounded-full border-2 ${
          completed 
            ? 'bg-green-500 border-green-500' 
            : 'border-gray-500'
        }`}>
          {completed && (
            <svg className="w-full h-full text-white p-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span className={`text-sm ${completed ? 'text-green-400' : 'text-gray-300'}`}>
          {title}
        </span>
      </div>
      
      {completed && (
        <Badge variant="success">Completed</Badge>
      )}
    </div>
  )
}
