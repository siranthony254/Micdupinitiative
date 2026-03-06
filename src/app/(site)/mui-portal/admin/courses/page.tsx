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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    order_index: 0,
  })
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [lessonsLoading, setLessonsLoading] = useState(false)
  const [lessonSubmitting, setLessonSubmitting] = useState(false)

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

  const openLessonManager = async (course: Course) => {
    setSelectedCourse(course)
    setEditingLesson(null)
    setLessonForm({ title: '', content: '', order_index: 0 })
    setLessonsLoading(true)

    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index', { ascending: true })

      if (error) return
      setLessons(data || [])
    } catch (error) {
      // Silent error handling
      setLessons([])
    } finally {
      setLessonsLoading(false)
    }
  }

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return
    setLessonSubmitting(true)

    try {
      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update({
            title: lessonForm.title,
            content: lessonForm.content,
            order_index: lessonForm.order_index,
          })
          .eq('id', editingLesson.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({
            course_id: selectedCourse.id,
            title: lessonForm.title,
            content: lessonForm.content,
            order_index: lessonForm.order_index,
          })

        if (error) throw error
      }

      setLessonForm({ title: '', content: '', order_index: 0 })
      setEditingLesson(null)
      await openLessonManager(selectedCourse)
    } catch (error) {
      // Silent error handling
    } finally {
      setLessonSubmitting(false)
    }
  }

  const handleLessonEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonForm({
      title: lesson.title,
      content: lesson.content || '',
      order_index: lesson.order_index,
    })
  }

  const handleLessonDelete = async (lessonId: string) => {
    if (!selectedCourse) return
    if (!confirm('Delete this lesson? This will also remove associated progress records.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)

      if (error) throw error
      await openLessonManager(selectedCourse)
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
          <>
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
                    <button
                      type="button"
                      onClick={() => openLessonManager(course)}
                      className="flex-1 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-center text-sm"
                    >
                      Manage Lessons
                    </button>
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

            {selectedCourse && (
              <div className="mt-10 bg-gray-900 border border-amber-500/60 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-500">
                      Manage Lessons – {selectedCourse.title}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Create, edit, and reorder lessons for this course.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourse(null)
                      setLessons([])
                      setEditingLesson(null)
                      setLessonForm({ title: '', content: '', order_index: 0 })
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-500 mb-3">
                      {editingLesson ? 'Edit Lesson' : 'Add Lesson'}
                    </h3>
                    <form onSubmit={handleLessonSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-300 mb-2">
                          Title
                        </label>
                        <input
                          id="lessonTitle"
                          type="text"
                          required
                          value={lessonForm.title}
                          onChange={(e) =>
                            setLessonForm({ ...lessonForm, title: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Lesson title"
                        />
                      </div>

                      <div>
                        <label htmlFor="lessonContent" className="block text-sm font-medium text-gray-300 mb-2">
                          Content
                        </label>
                        <textarea
                          id="lessonContent"
                          rows={4}
                          value={lessonForm.content}
                          onChange={(e) =>
                            setLessonForm({ ...lessonForm, content: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Lesson content or notes"
                        />
                      </div>

                      <div>
                        <label htmlFor="lessonOrder" className="block text-sm font-medium text-gray-300 mb-2">
                          Order Index
                        </label>
                        <input
                          id="lessonOrder"
                          type="number"
                          value={lessonForm.order_index}
                          onChange={(e) =>
                            setLessonForm({
                              ...lessonForm,
                              order_index: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={lessonSubmitting}
                          className="px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          {lessonSubmitting
                            ? 'Saving...'
                            : editingLesson
                            ? 'Update Lesson'
                            : 'Add Lesson'}
                        </button>
                        {editingLesson && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLesson(null)
                              setLessonForm({ title: '', content: '', order_index: 0 })
                            }}
                            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-amber-500 mb-3">Existing Lessons</h3>
                    {lessonsLoading ? (
                      <p className="text-gray-400 text-sm">Loading lessons...</p>
                    ) : lessons.length === 0 ? (
                      <p className="text-gray-400 text-sm">
                        No lessons yet. Create the first lesson for this course.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="border border-gray-800 rounded-lg p-4 bg-gray-950/40 flex items-start justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                #{lesson.order_index + 1}
                              </p>
                              <p className="text-white font-medium">{lesson.title}</p>
                              {lesson.content && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {lesson.content}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => handleLessonEdit(lesson)}
                                className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-xs"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLessonDelete(lesson.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
