import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: 'student' | 'admin'
  joined_at: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Cohort {
  id: string
  name: string
  description: string | null
  secret_key: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  cohort_id: string
  enrolled_at: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ContentSection {
  id: string
  lesson_id?: string
  cohort_id?: string
  title: string
  subtitle?: string
  content: string
  order_index: number
  created_at: string
  updated_at: string
}

// Helper functions
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getCourseWithLessons(courseId: string): Promise<Course & { lessons: Lesson[] }> {
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()
  
  if (courseError) throw courseError
  
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
  
  if (lessonsError) throw lessonsError
  
  return { ...course, lessons: lessons || [] }
}

export async function getCohorts(): Promise<Cohort[]> {
  const { data, error } = await supabase
    .from('cohorts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function enrollInCohort(userId: string, secretKey: string): Promise<Enrollment | null> {
  // First find the cohort by secret key
  const { data: cohort, error: cohortError } = await supabase
    .from('cohorts')
    .select('*')
    .eq('secret_key', secretKey)
    .single()
  
  if (cohortError || !cohort) {
    throw new Error('Invalid secret key')
  }
  
  // Check if already enrolled
  const { data: existing, error: existingError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('cohort_id', cohort.id)
    .single()
  
  if (existing && !existingError) {
    throw new Error('Already enrolled in this cohort')
  }
  
  // Create enrollment
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ user_id: userId, cohort_id: cohort.id })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserEnrollments(userId: string): Promise<(Enrollment & { cohort: Cohort })[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      cohort:cohorts(*)
    `)
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function toggleLessonProgress(userId: string, lessonId: string): Promise<Progress> {
  // Check if progress exists
  const { data: existing, error: existingError } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()
  
  if (existingError && existingError.code !== 'PGRST116') {
    throw existingError
  }
  
  if (existing) {
    // Toggle completion
    const { data, error } = await supabase
      .from('progress')
      .update({ 
        completed: !existing.completed,
        completed_at: existing.completed ? null : new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } else {
    // Create new progress record
    const { data, error } = await supabase
      .from('progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export async function getUserProgress(userId: string): Promise<Progress[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function calculateProgress(userId: string, courseId?: string, cohortId?: string): Promise<number> {
  if (courseId) {
    const { data, error } = await supabase.rpc('calculate_course_progress', {
      user_uuid: userId,
      course_uuid: courseId
    })
    
    if (error) throw error
    return data || 0
  }
  
  if (cohortId) {
    const { data, error } = await supabase.rpc('calculate_cohort_progress', {
      user_uuid: userId,
      cohort_uuid: cohortId
    })
    
    if (error) throw error
    return data || 0
  }
  
  return 0
}

// Content Section functions
export async function getContentSections(lessonId?: string, cohortId?: string): Promise<ContentSection[]> {
  let query = supabase.from('content_sections').select('*').order('order_index', { ascending: true })
  
  if (lessonId) {
    query = query.eq('lesson_id', lessonId)
  } else if (cohortId) {
    query = query.eq('cohort_id', cohortId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export async function createContentSection(section: Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>): Promise<ContentSection> {
  const { data, error } = await supabase
    .from('content_sections')
    .insert(section)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateContentSection(id: string, updates: Partial<ContentSection>): Promise<ContentSection> {
  const { data, error } = await supabase
    .from('content_sections')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteContentSection(id: string): Promise<void> {
  const { error } = await supabase
    .from('content_sections')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function duplicateContentSection(id: string): Promise<ContentSection> {
  // First get the original section
  const { data: original, error: fetchError } = await supabase
    .from('content_sections')
    .select('*')
    .eq('id', id)
    .single()
  
  if (fetchError) throw fetchError
  
  // Create a duplicate with "Copy of" prefix
  const duplicate = {
    lesson_id: original.lesson_id,
    cohort_id: original.cohort_id,
    title: `Copy of ${original.title}`,
    subtitle: original.subtitle,
    content: original.content,
    order_index: original.order_index + 1 // Place it right after the original
  }
  
  return await createContentSection(duplicate)
}
