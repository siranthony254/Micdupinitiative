"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  created_at: string
  lessons?: Lesson[]
}

interface Lesson {
  id: string
  title: string
  content?: string
  order_index: number
}

export default function AdminCoursesPage() {
  const { user, profile, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && (!isAdmin || !user)) {
      router.push('/mui-portal/dashboard')
      return
    }

    if (isAdmin && user) {
      fetchCourses()
    }
  }, [isAdmin, user, loading, router])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          lessons (id)
        `)
        .order('created_at', { ascending: false })

      if (error) return
      setCourses(data || [])
    } catch (error) {
      // Silent error handling
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: formData.title,
            description: formData.description,
            thumbnail: formData.thumbnail || null
          })
          .eq('id', editingCourse.id)

        if (error) throw error
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert({
            title: formData.title,
            description: formData.description,
            thumbnail: formData.thumbnail || null
          })

        if (error) throw error
      }

      // Reset form and refresh
      setFormData({ title: '', description: '', thumbnail: '' })
      setEditingCourse(null)
      setShowCreateForm(false)
      await fetchCourses()
    } catch (error) {
      // Silent error handling
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail || ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all lessons and progress data.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error
      await fetchCourses()
    } catch (error) {
      // Silent error handling
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

  if (!user || !profile || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
          <p className="mt-2 text-gray-400">Admin access required.</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-500 mb-2">Manage Courses</h1>
            <p className="text-gray-400">Create and manage courses</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
          >
            Create New Course
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-amber-500 mb-4">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Course Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter course description"
                />
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail URL (optional)
                </label>
                <input
                  id="thumbnail"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter thumbnail image URL"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {submitting ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingCourse(null)
                    setFormData({ title: '', description: '', thumbnail: '' })
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-amber-500 mb-2">No Courses Yet</h3>
            <p className="text-gray-400 mb-4">Create your first course to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
            >
              Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-500 mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{course.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{course.lessons?.length || 0} lessons</span>
                  <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/mui-portal/admin/courses/${course.id}/lessons`}
                    className="flex-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-center text-sm"
                  >
                    Manage Lessons
                  </Link>
                  <button
                    onClick={() => handleEdit(course)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
