"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/mui-auth-context'
import { Card, Button, Input, Alert } from '@/components/ui'
import RichTextEditor from '@/components/rich-text-editor'
import { getCohorts, getContentSections, createContentSection, updateContentSection, deleteContentSection, duplicateContentSection } from '@/lib/mui-portal'
import { Cohort, ContentSection } from '@/lib/mui-portal'

export default function AdminCohortsEnhanced() {
  const { isAdmin } = useAuth()
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null)
  const [sections, setSections] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCohortForm, setShowCohortForm] = useState(false)
  const [showSectionForm, setShowSectionForm] = useState(false)
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form states
  const [cohortForm, setCohortForm] = useState({ name: '', description: '', secret_key: '' })
  const [sectionForm, setSectionForm] = useState({ title: '', subtitle: '', content: '' })

  useEffect(() => {
    if (!isAdmin) return
    loadCohorts()
  }, [isAdmin])

  useEffect(() => {
    if (selectedCohort) {
      loadSections()
    }
  }, [selectedCohort])

  const loadCohorts = async () => {
    try {
      const cohortsData = await getCohorts()
      setCohorts(cohortsData)
    } catch (error) {
      console.error('Error loading cohorts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSections = async () => {
    if (!selectedCohort) return
    try {
      const sectionsData = await getContentSections(undefined, selectedCohort.id)
      setSections(sectionsData)
    } catch (error) {
      console.error('Error loading sections:', error)
    }
  }

  const generateSecretKey = () => {
    const key = Math.random().toString(36).substring(2, 8).toUpperCase() + 
                 Math.random().toString(36).substring(2, 6).toUpperCase()
    setCohortForm({ ...cohortForm, secret_key: key })
  }

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const response = await fetch('/api/admin/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cohortForm)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Cohort created successfully!' })
        setCohortForm({ name: '', description: '', secret_key: '' })
        setShowCohortForm(false)
        await loadCohorts()
      } else {
        throw new Error('Failed to create cohort')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create cohort' })
    }
  }

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCohort) return

    try {
      const sectionData = {
        cohort_id: selectedCohort.id,
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
          <h1 className="text-3xl font-bold text-white">Cohort Content Management</h1>
          <p className="mt-2 text-gray-400">Create and manage cohorts with rich content sections</p>
        </div>
        <Button onClick={() => setShowCohortForm(true)}>
          Create New Cohort
        </Button>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type}>
          {message.text}
        </Alert>
      )}

      {/* Create Cohort Form */}
      {showCohortForm && (
        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">Create New Cohort</h2>
          <form onSubmit={handleCreateCohort} className="space-y-4">
            <Input
              label="Cohort Name"
              type="text"
              placeholder="Enter cohort name"
              value={cohortForm.name}
              onChange={(value) => setCohortForm({ ...cohortForm, name: value })}
              required
            />

            <Input
              label="Description"
              type="text"
              placeholder="Enter cohort description"
              value={cohortForm.description}
              onChange={(value) => setCohortForm({ ...cohortForm, description: value })}
            />

            <div className="space-y-2">
              <Input
                label="Secret Key"
                type="text"
                placeholder="Enter secret key"
                value={cohortForm.secret_key}
                onChange={(value) => setCohortForm({ ...cohortForm, secret_key: value })}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSecretKey}
              >
                Generate Secret Key
              </Button>
            </div>

            <div className="flex space-x-3">
              <Button type="submit">Create Cohort</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCohortForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Cohorts List */}
      {!selectedCohort ? (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Cohorts</h2>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : cohorts.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-400">No cohorts found.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {cohorts.map((cohort) => (
                <Card key={cohort.id} hover className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div onClick={() => setSelectedCohort(cohort)}>
                      <h3 className="text-lg font-semibold text-white">{cohort.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{cohort.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-xs text-gray-500">
                          Secret Key: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{cohort.secret_key}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Created {new Date(cohort.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setSelectedCohort(cohort)}>
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
        /* Cohort Detail View */
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCohort(null)
                }}
              >
                ← Back to Cohorts
              </Button>
              <h2 className="text-2xl font-bold text-white mt-4">{selectedCohort.name}</h2>
              <p className="text-gray-400 mt-1">{selectedCohort.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Secret Key: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{selectedCohort.secret_key}</span>
              </p>
            </div>
            <Button onClick={() => setShowSectionForm(true)}>
              Add Content Section
            </Button>
          </div>

          {/* Create/Edit Section Form */}
          {showSectionForm && (
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">
                {editingSection ? 'Edit Section' : 'Create New Section'}
              </h3>
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

          {/* Content Sections */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Content Sections - {selectedCohort.name}
            </h3>
            
            {sections.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <p className="text-gray-400">No content sections yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add your first content section to get started.
                  </p>
                </div>
              </Card>
            ) : (
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
                      
                      <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
                        Order: {section.order_index + 1} • 
                        Created: {new Date(section.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
