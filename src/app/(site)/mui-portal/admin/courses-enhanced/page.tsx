"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/mui-auth-context'
import { Card, Button, Input, Alert } from '@/components/ui'
import RichTextEditor from '@/components/rich-text-editor'
import { getCourses, getCourseWithLessons, getContentSections, createContentSection, updateContentSection, deleteContentSection, duplicateContentSection } from '@/lib/mui-portal'
import { Course, Lesson, ContentSection } from '@/lib/mui-portal'

export default function AdminCoursesEnhanced() {
  const { isAdmin } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course & { lessons: Lesson[] } | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [sections, setSections] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form states
  const [courseForm, setCourseForm] = useState({ title: '', description: '', thumbnail: '' })
  const [lessonForm, setLessonForm] = useState({ title: '', content: '' })
  const [sectionForm, setSectionForm] = useState({ title: '', subtitle: '', content: '' })

  useEffect(() => {
    if (!isAdmin) return
    loadCourses()
  }, [isAdmin])

  useEffect(() => {
    if (selectedLesson) {
      loadSections()
    }
  }, [selectedLesson])

  const loadCourses = async () => {
    try {
      const coursesData = await getCourses()
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCourseDetails = async (courseId: string) => {
    try {
      const courseData = await getCourseWithLessons(courseId)
      setSelectedCourse(courseData)
    } catch (error) {
      console.error('Error loading course details:', error)
    }
  }

  const loadSections = async () => {
    if (!selectedLesson) return
    try {
      const sectionsData = await getContentSections(selectedLesson.id)
      setSections(sectionsData)
    } catch (error) {
      console.error('Error loading sections:', error)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Course created successfully!' })
        setCourseForm({ title: '', description: '', thumbnail: '' })
        setShowCourseForm(false)
        await loadCourses()
      } else {
        throw new Error('Failed to create course')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create course' })
    }
  }

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return

    try {
      const response = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lessonForm,
          course_id: selectedCourse.id,
          order_index: selectedCourse.lessons.length
        })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Lesson created successfully!' })
        setLessonForm({ title: '', content: '' })
        setShowLessonForm(false)
        await loadCourseDetails(selectedCourse.id)
      } else {
        throw new Error('Failed to create lesson')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create lesson' })
    }
  }

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLesson) return

    try {
      const sectionData = {
        lesson_id: selectedLesson.id,
        title: sectionForm.title,
        subtitle: sectionForm.subtitle || null,
        content: sectionForm.content,
        order_index: sections.length
      }

      if (editingSection) {
        await updateContentSection(editingSection.id, sectionData)
        setMessage({ type: 'success', text: 'Section updated successfully!' })
      } else {
        await createContentSection(sectionData)
        setMessage({ type: 'success', text: 'Section created successfully!' })
      }

      setSectionForm({ title: '', subtitle: '', content: '' })
      setEditingSection(null)
      setShowSectionForm(false)
      await loadSections()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save section' })
    }
  }

  const handleEditSection = (section: ContentSection) => {
    setEditingSection(section)
    setSectionForm({
      title: section.title,
      subtitle: section.subtitle || '',
      content: section.content
    })
    setShowSectionForm(true)
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      await deleteContentSection(sectionId)
      setMessage({ type: 'success', text: 'Section deleted successfully!' })
      await loadSections()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete section' })
    }
  }

  const handleDuplicateSection = async (sectionId: string) => {
    try {
      await duplicateContentSection(sectionId)
      setMessage({ type: 'success', text: 'Section duplicated successfully!' })
      await loadSections()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to duplicate section' })
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Course Content Management</h1>
          <p className="mt-2 text-gray-400">Create and manage courses with rich content sections</p>
        </div>
        <Button onClick={() => setShowCourseForm(true)}>
          Create New Course
        </Button>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type}>
          {message.text}
        </Alert>
      )}

      {/* Create Course Form */}
      {showCourseForm && (
        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">Create New Course</h2>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <Input
              label="Course Title"
              type="text"
              placeholder="Enter course title"
              value={courseForm.title}
              onChange={(value) => setCourseForm({ ...courseForm, title: value })}
              required
            />

            <Input
              label="Description"
              type="text"
              placeholder="Enter course description"
              value={courseForm.description}
              onChange={(value) => setCourseForm({ ...courseForm, description: value })}
            />

            <Input
              label="Thumbnail URL"
              type="text"
              placeholder="Enter thumbnail URL (optional)"
              value={courseForm.thumbnail}
              onChange={(value) => setCourseForm({ ...courseForm, thumbnail: value })}
            />

            <div className="flex space-x-3">
              <Button type="submit">Create Course</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCourseForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Courses List */}
      {!selectedCourse ? (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Courses</h2>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-400">No courses found.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} hover className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div onClick={() => loadCourseDetails(course.id)}>
                      <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{course.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created {new Date(course.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => loadCourseDetails(course.id)}>
                        Manage Content
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Course Detail View */
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCourse(null)
                  setSelectedLesson(null)
                }}
              >
                ← Back to Courses
              </Button>
              <h2 className="text-2xl font-bold text-white mt-4">{selectedCourse.title}</h2>
              <p className="text-gray-400 mt-1">{selectedCourse.description}</p>
            </div>
            <Button onClick={() => setShowLessonForm(true)}>
              Add Lesson
            </Button>
          </div>

          {/* Create Lesson Form */}
          {showLessonForm && (
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Create New Lesson</h3>
              <form onSubmit={handleCreateLesson} className="space-y-4">
                <Input
                  label="Lesson Title"
                  type="text"
                  placeholder="Enter lesson title"
                  value={lessonForm.title}
                  onChange={(value) => setLessonForm({ ...lessonForm, title: value })}
                  required
                />

                <div className="flex space-x-3">
                  <Button type="submit">Create Lesson</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLessonForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Lessons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lessons List */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Lessons</h3>
              <div className="space-y-3">
                {selectedCourse.lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    hover
                    className={`cursor-pointer ${selectedLesson?.id === lesson.id ? 'border-amber-500' : ''}`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{lesson.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Order: {lesson.order_index + 1}
                        </p>
                      </div>
                      <div className="text-amber-500">
                        {selectedLesson?.id === lesson.id && '→'}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            {selectedLesson && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Content Sections - {selectedLesson.title}
                  </h3>
                  <Button size="sm" onClick={() => setShowSectionForm(true)}>
                    Add Section
                  </Button>
                </div>

                {/* Create/Edit Section Form */}
                {showSectionForm && (
                  <Card className="mb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">
                      {editingSection ? 'Edit Section' : 'Create New Section'}
                    </h4>
                    <form onSubmit={handleCreateSection} className="space-y-4">
                      <Input
                        label="Section Title"
                        type="text"
                        placeholder="Enter section title"
                        value={sectionForm.title}
                        onChange={(value) => setSectionForm({ ...sectionForm, title: value })}
                        required
                      />

                      <Input
                        label="Subtitle (Optional)"
                        type="text"
                        placeholder="Enter subtitle"
                        value={sectionForm.subtitle}
                        onChange={(value) => setSectionForm({ ...sectionForm, subtitle: value })}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Content
                        </label>
                        <RichTextEditor
                          value={sectionForm.content}
                          onChange={(value) => setSectionForm({ ...sectionForm, content: value })}
                          placeholder="Enter section content..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button type="submit">
                          {editingSection ? 'Update Section' : 'Create Section'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowSectionForm(false)
                            setEditingSection(null)
                            setSectionForm({ title: '', subtitle: '', content: '' })
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                {/* Sections List */}
                <div className="space-y-4">
                  {sections.map((section) => (
                    <Card key={section.id}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{section.title}</h4>
                            {section.subtitle && (
                              <p className="text-sm text-gray-400 mt-1">{section.subtitle}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditSection(section)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDuplicateSection(section.id)}>
                              Duplicate
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteSection(section.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                          <div 
                            className="text-gray-300 text-sm"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
