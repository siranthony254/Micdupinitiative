"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { getCohorts } from '@/lib/mui-portal'
import Link from 'next/link'

interface Cohort {
  id: string
  name: string
  description: string | null
  secret_key: string
  created_at: string
  updated_at: string
}

interface Enrollment {
  id: string
  user_id: string
  cohort_id: string
  enrolled_at: string
  status: 'active' | 'completed' | 'dropped'
  progress?: number
  user?: {
    full_name: string
    email: string
  }
}

interface Course {
  id: string
  title: string
  description: string
  created_at: string
}

interface Analytics {
  total_enrolled: number
  active_learners: number
  completed_learners: number
  average_progress: number
}

export default function AdminCohortsPage() {
  const { user, profile, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null)
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    secret_key: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  useEffect(() => {
    if (!loading && (!isAdmin || !user)) {
      router.push('/mui-portal/dashboard')
      return
    }

    if (isAdmin && user) {
      fetchCohorts()
    }
  }, [isAdmin, user, loading, router])

  const fetchCohorts = async () => {
    try {
      const data = await getCohorts()
      console.log('Fetched cohorts:', data)
      setCohorts(data)
    } catch (error) {
      console.error('Error fetching cohorts:', error)
    }
  }

  const fetchAnalytics = async (cohortId: string) => {
    try {
      setAnalyticsLoading(true)
      
      // Get detailed analytics for the cohort
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          status,
          progress,
          user:profiles (
            full_name,
            email
          )
        `)
        .eq('cohort_id', cohortId)

      if (error) {
        console.error('Error fetching analytics:', error)
        return
      }

      const totalEnrolled = enrollments?.length || 0
      const activeLearners = enrollments?.filter(e => e.status === 'active').length || 0
      const completedLearners = enrollments?.filter(e => e.status === 'completed').length || 0
      const averageProgress = enrollments?.reduce((acc, e) => acc + (e.progress || 0), 0) / totalEnrolled || 0

      setAnalytics({
        total_enrolled: totalEnrolled,
        active_learners: activeLearners,
        completed_learners: completedLearners,
        average_progress: Math.round(averageProgress)
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const cohortData = {
        ...formData,
        created_at: new Date().toISOString()
      }

      if (editingCohort) {
        // Update existing cohort
        const { error } = await supabase
          .from('cohorts')
          .update(cohortData)
          .eq('id', editingCohort.id)

        if (error) {
          console.error('Error updating cohort:', error)
          alert('Failed to update cohort: ' + error.message)
        } else {
          alert('Cohort updated successfully!')
          setEditingCohort(null)
          setShowCreateForm(false)
          resetForm()
          await fetchCohorts()
        }
      } else {
        // Create new cohort
        const { error } = await supabase
          .from('cohorts')
          .insert(cohortData)

        if (error) {
          console.error('Error creating cohort:', error)
          alert('Failed to create cohort: ' + error.message)
        } else {
          alert('Cohort created successfully!')
          setShowCreateForm(false)
          resetForm()
          await fetchCohorts()
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      secret_key: ''
    })
  }

  const editCohort = (cohort: Cohort) => {
    console.log('Editing cohort:', cohort)
    setEditingCohort(cohort)
    setFormData({
      name: cohort.name,
      description: cohort.description || '',
      secret_key: cohort.secret_key
    })
    setShowCreateForm(true)
  }

  const deleteCohort = async (cohortId: string) => {
    console.log('Deleting cohort:', cohortId)
    if (!confirm('Are you sure you want to delete this cohort? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cohorts')
        .delete()
        .eq('id', cohortId)

      if (error) {
        console.error('Error deleting cohort:', error)
        alert('Failed to delete cohort: ' + error.message)
      } else {
        alert('Cohort deleted successfully!')
        await fetchCohorts()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">You don't have permission to access this page.</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-500 mb-2">Manage Cohorts</h1>
            <p className="text-gray-400">Create and manage cohort programs</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition"
          >
            Create New Cohort
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cohort Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Secret Key *</label>
                <input
                  type="text"
                  value={formData.secret_key}
                  onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  placeholder="Enter secret key for cohort enrollment"
                  required
                />
              </div>

              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingCohort ? 'Update Cohort' : 'Create Cohort')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingCohort(null)
                    resetForm()
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cohorts List */}
        <div className="space-y-6">
          {cohorts.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No cohorts found.</p>
              <p className="text-sm text-gray-500 mt-2">Create your first cohort to get started.</p>
            </div>
          ) : (
            cohorts.map((cohort) => (
              <div key={cohort.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{cohort.name}</h3>
                    <p className="text-gray-400 mb-2">{cohort.description || 'No description'}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Secret Key: <code className="bg-gray-800 px-2 py-1 rounded">{cohort.secret_key}</code></span>
                      <span>Created: {new Date(cohort.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => fetchAnalytics(cohort.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => editCohort(cohort)}
                      className="px-4 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCohort(cohort.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Analytics Display */}
                {selectedCohort?.id === cohort.id && analytics && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-lg font-semibold text-amber-400 mb-3">Analytics Dashboard</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{analytics.total_enrolled}</p>
                        <p className="text-sm text-gray-400">Total Enrolled</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{analytics.active_learners}</p>
                        <p className="text-sm text-gray-400">Active Learners</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{analytics.completed_learners}</p>
                        <p className="text-sm text-gray-400">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-400">{analytics.average_progress}%</p>
                        <p className="text-sm text-gray-400">Avg Progress</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
