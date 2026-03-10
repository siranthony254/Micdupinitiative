-- ============================================
-- MUI PORTAL - PRODUCTION DATABASE SCHEMA
-- Learning + Cohort Platform for Campus Initiative
-- ============================================

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. COURSES (SELF-PACED LEARNING)
-- ============================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. LESSONS (COURSE CONTENT) - Enhanced with Sections
-- ============================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Sections for Lessons and Cohorts
CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT lesson_or_cohort CHECK (
    (lesson_id IS NOT NULL AND cohort_id IS NULL) OR
    (lesson_id IS NULL AND cohort_id IS NOT NULL)
  )
);

-- ============================================
-- 4. COHORTS (SECRET KEY ACCESS GROUPS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  secret_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. COHORT_LESSONS (COHORT SPECIFIC LESSONS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cohort_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (cohort_id, lesson_id)
);

-- ============================================
-- 6. ENROLLMENTS (USER ↔ COHORT RELATIONSHIP)
-- ============================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, cohort_id)
);

-- ============================================
-- 7. PROGRESS (LESSON COMPLETION TRACKING)
-- ============================================
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_lesson_id ON public.content_sections(lesson_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_cohort_id ON public.content_sections(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_lessons_cohort_id ON public.cohort_lessons(cohort_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_cohort_id ON public.enrollments(cohort_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON public.progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON public.progress(completed);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECURITY FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- COURSES
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (public.is_admin());

-- LESSONS
CREATE POLICY "Anyone can view lessons" ON public.lessons
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL USING (public.is_admin());

-- CONTENT SECTIONS
CREATE POLICY "Anyone can view content sections" ON public.content_sections
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage content sections" ON public.content_sections
  FOR ALL USING (public.is_admin());

-- COHORTS
CREATE POLICY "Anyone can view cohorts" ON public.cohorts
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage cohorts" ON public.cohorts
  FOR ALL USING (public.is_admin());

-- COHORT_LESSONS
CREATE POLICY "Anyone can view cohort lessons" ON public.cohort_lessons
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage cohort lessons" ON public.cohort_lessons
  FOR ALL USING (public.is_admin());

-- ENROLLMENTS
CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- PROGRESS
CREATE POLICY "Users can view own progress" ON public.progress
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can manage own progress" ON public.progress
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- PROGRESS CALCULATION FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_course_progress(
  user_uuid UUID,
  course_uuid UUID
)
RETURNS FLOAT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage FLOAT;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM public.lessons
  WHERE course_id = course_uuid;

  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO completed_lessons
  FROM public.progress
  WHERE user_id = user_uuid
    AND lesson_id IN (
      SELECT id FROM public.lessons WHERE course_id = course_uuid
    )
    AND completed = TRUE;

  progress_percentage := (completed_lessons::FLOAT / total_lessons::FLOAT) * 100;
  RETURN ROUND(progress_percentage, 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_cohort_progress(
  user_uuid UUID,
  cohort_uuid UUID
)
RETURNS FLOAT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage FLOAT;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM public.cohort_lessons
  WHERE cohort_id = cohort_uuid;

  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO completed_lessons
  FROM public.progress
  WHERE user_id = user_uuid
    AND lesson_id IN (
      SELECT lesson_id FROM public.cohort_lessons WHERE cohort_id = cohort_uuid
    )
    AND completed = TRUE;

  progress_percentage := (completed_lessons::FLOAT / total_lessons::FLOAT) * 100;
  RETURN ROUND(progress_percentage, 2);
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'student'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cohorts_updated_at ON public.cohorts;
CREATE TRIGGER update_cohorts_updated_at
  BEFORE UPDATE ON public.cohorts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_progress_updated_at ON public.progress;
CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_sections_updated_at ON public.content_sections;
CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Sample course
INSERT INTO public.courses (title, description, thumbnail) VALUES
('Camera Training Basics', 'Learn the fundamentals of camera operation and photography techniques.', '/images/camera-course.jpg'),
('Leadership Development', 'Develop essential leadership skills for campus initiatives.', '/images/leadership-course.jpg')
ON CONFLICT DO NOTHING;

-- Sample lessons
INSERT INTO public.lessons (course_id, title, content, order_index) VALUES
((SELECT id FROM public.courses WHERE title = 'Camera Training Basics' LIMIT 1), 
 'Introduction to Cameras', 'Learn about different types of cameras and their basic functions.', 1),
((SELECT id FROM public.courses WHERE title = 'Camera Training Basics' LIMIT 1), 
 'Camera Settings', 'Understanding aperture, ISO, and shutter speed.', 2),
((SELECT id FROM public.courses WHERE title = 'Leadership Development' LIMIT 1), 
 'What is Leadership?', 'Exploring the concept and importance of leadership.', 1)
ON CONFLICT DO NOTHING;

-- Sample cohort
INSERT INTO public.cohorts (name, description, secret_key) VALUES
('Camera Training Cohort 2024', 'A focused cohort for learning camera skills together.', 'CAMERA2024'),
('Leadership Circle', 'Develop leadership skills with peers.', 'LEAD2024')
ON CONFLICT DO NOTHING;

-- Assign lessons to cohorts
INSERT INTO public.cohort_lessons (cohort_id, lesson_id, order_index) VALUES
((SELECT id FROM public.cohorts WHERE name = 'Camera Training Cohort 2024' LIMIT 1), 
 (SELECT id FROM public.lessons WHERE title = 'Introduction to Cameras' LIMIT 1), 1),
((SELECT id FROM public.cohorts WHERE name = 'Camera Training Cohort 2024' LIMIT 1), 
 (SELECT id FROM public.lessons WHERE title = 'Camera Settings' LIMIT 1), 2),
((SELECT id FROM public.cohorts WHERE name = 'Leadership Circle' LIMIT 1), 
 (SELECT id FROM public.lessons WHERE title = 'What is Leadership?' LIMIT 1), 1)
ON CONFLICT DO NOTHING;

-- ============================================
-- MUI PORTAL SCHEMA COMPLETE
-- Ready for production deployment
-- ============================================
