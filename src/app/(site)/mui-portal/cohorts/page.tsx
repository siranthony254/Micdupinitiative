"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Cohort {
  id: string
  name: string
  description: string
  secret_key: string
  member_count?: number
  enrolled?: boolean
}

export default function CohortsPage() {
  const { user, loading } = useAuth()
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [enrolledCohorts, setEnrolledCohorts] = useState<string[]>([])
  const [secretKey, setSecretKey] = useState('')
  const [joining, setJoining] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchCohorts()
      fetchEnrollments()
    }
  }, [user])

  const fetchCohorts = async () => {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .select(`
          *,
          enrollments!inner(count)
        `)
        .order('created_at', { ascending: false })

      if (error) return

      // Transform data to include member count
      const cohortsWithCounts = data?.map(cohort => ({
        ...cohort,
        member_count: Array.isArray(cohort.enrollments) ? cohort.enrollments.length : 0
      })) || []

      setCohorts(cohortsWithCounts)
    } catch (error) {
      // Silent error handling
    } finally {
      setDataLoading(false)
    }
  }

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('cohort_id')
        .eq('user_id', user!.id)

      if (error) return
      setEnrolledCohorts(data?.map(e => e.cohort_id) || [])
    } catch (error) {
      // Silent error handling
    }
  }

  const joinCohort = async (e: React.FormEvent) => {
    e.preventDefault()
    setJoining(true)
    setMessage('')

    try {
      // Find cohort with matching secret key
      const { data: cohort, error: cohortError } = await supabase
        .from('cohorts')
        .select('*')
        .eq('secret_key', secretKey.trim())
        .single()

      if (cohortError || !cohort) {
        setMessage('Invalid secret key. Please check and try again.')
        setMessageType('error')
        return
      }

      // Check if already enrolled
      if (enrolledCohorts.includes(cohort.id)) {
        setMessage('You are already enrolled in this cohort.')
        setMessageType('error')
        return
      }

      // Create enrollment
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          user_id: user!.id,
          cohort_id: cohort.id
        })

      if (enrollmentError) throw enrollmentError

      setMessage(`Successfully enrolled in "${cohort.name}"!`)
      setMessageType('success')
      setSecretKey('')
      
      // Refresh data
      await fetchEnrollments()
      await fetchCohorts()
    } catch (error) {
      setMessage('An error occurred while joining the cohort. Please try again.')
      setMessageType('error')
    } finally {
      setJoining(false)
    }
  }

  const leaveCohort = async (cohortId: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', user!.id)
        .eq('cohort_id', cohortId)

      if (error) throw error

      // Refresh data
      await fetchEnrollments()
      await fetchCohorts()
    } catch (error) {
      // Silent error handling
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading cohorts...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">Please sign in to access cohorts.</p>
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
          <h1 className="text-3xl font-bold text-amber-500 mb-2">Cohorts</h1>
          <p className="text-gray-400">Join exclusive cohort programs using secret keys</p>
        </div>

        {/* Join Cohort Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Join a Cohort</h2>
          <form onSubmit={joinCohort} className="space-y-4">
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-300 mb-2">
                Secret Key
              </label>
              <input
                id="secretKey"
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter the secret key provided by your cohort administrator"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
            
            {message && (
              <div className={`px-4 py-3 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-600/20 border border-green-600 text-green-400'
                  : 'bg-red-600/20 border border-red-600 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={joining || !secretKey.trim()}
              className="px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {joining ? 'Joining...' : 'Join Cohort'}
            </button>
          </form>
        </div>

        {/* Available Cohorts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Available Cohorts</h2>
          
          {cohorts.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No cohorts are available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohorts.map((cohort) => {
                const isEnrolled = enrolledCohorts.includes(cohort.id)
                return (
                  <div
                    key={cohort.id}
                    className={`bg-gray-900 border rounded-lg p-6 transition ${
                      isEnrolled 
                        ? 'border-green-600' 
                        : 'border-gray-800 hover:border-amber-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-amber-500">
                        {cohort.name}
                      </h3>
                      {isEnrolled && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                          Enrolled
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">
                      {cohort.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{cohort.member_count || 0} members</span>
                      <span>Secret key required</span>
                    </div>

                    <div className="flex gap-2">
                      {isEnrolled ? (
                        <>
                          <Link
                            href={`/mui-portal/cohorts/${cohort.id}`}
                            className="flex-1 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition text-center"
                          >
                            View Cohort
                          </Link>
                          <button
                            onClick={() => leaveCohort(cohort.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Leave
                          </button>
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm italic">
                          Enter secret key above to join
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Your Enrolled Cohorts */}
        {enrolledCohorts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Your Enrolled Cohorts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohorts
                .filter(cohort => enrolledCohorts.includes(cohort.id))
                .map((cohort) => (
                  <Link
                    key={cohort.id}
                    href={`/mui-portal/cohorts/${cohort.id}`}
                    className="bg-gray-900 border border-green-600 rounded-lg p-6 hover:border-amber-500 transition"
                  >
                    <h3 className="text-lg font-semibold text-amber-500 mb-2">
                      {cohort.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {cohort.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{cohort.member_count || 0} members</span>
                      <span className="text-green-400">→ View Details</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
