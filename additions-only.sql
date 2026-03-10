-- ============================================
-- ADDITIONAL SQL FOR ENHANCED CONTENT MANAGEMENT
-- Run only these new additions to your existing database
-- ============================================

-- 1. Add content_sections table
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

-- 2. Add indexes for content_sections
CREATE INDEX IF NOT EXISTS idx_content_sections_lesson_id ON public.content_sections(lesson_id);
CREATE INDEX IF NOT EXISTS idx_content_sections_cohort_id ON public.content_sections(cohort_id);

-- 3. Enable RLS on content_sections
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;

-- 4. Add RLS policies for content_sections
CREATE POLICY "Anyone can view content sections" ON public.content_sections
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage content sections" ON public.content_sections
  FOR ALL USING (public.is_admin());

-- 5. Add updated_at trigger for content_sections
CREATE TRIGGER IF EXISTS update_content_sections_updated_at ON public.content_sections
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Add sample content sections (optional)
INSERT INTO public.content_sections (lesson_id, title, subtitle, content, order_index)
SELECT 
  id, 
  'Introduction to Camera Basics', 
  'Getting Started with Photography',
  '<h1>Welcome to Camera Training</h1><p>This section covers the fundamentals of camera operation and photography basics.</p><ul><li>Understanding your camera</li><li>Basic photography principles</li><li>Getting started tips</li></ul>',
  0
FROM public.lessons 
WHERE title = 'Introduction to Cameras' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.content_sections (lesson_id, title, subtitle, content, order_index)
SELECT 
  id, 
  'Camera Settings Overview', 
  'Understanding Your Camera Controls',
  '<h2>Camera Settings Explained</h2><p>Learn about the essential camera settings that will help you take better photos.</p><h3>Key Settings to Master</h3><ul><li><strong>Aperture</strong> - Controls depth of field</li><li><strong>Shutter Speed</strong> - Controls motion blur</li><li><strong>ISO</strong> - Controls sensor sensitivity</li></ul>',
  0
FROM public.lessons 
WHERE title = 'Camera Settings' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- 7. Add sample cohort content sections
INSERT INTO public.content_sections (cohort_id, title, subtitle, content, order_index)
SELECT 
  id, 
  'Welcome to the Cohort', 
  'Getting Started Together',
  '<h1>Welcome to Camera Training Cohort 2024!</h1><p>We\'re excited to have you join our learning community. This cohort will help you master photography skills through collaborative learning.</p><h2>What to Expect</h2><ul><li>Weekly learning sessions</li><li>Peer feedback and support</li><li>Hands-on photography projects</li><li>Expert guidance and mentorship</li></ul>',
  0
FROM public.cohorts 
WHERE name = 'Camera Training Cohort 2024' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- SQL ADDITIONS COMPLETE
-- ============================================
