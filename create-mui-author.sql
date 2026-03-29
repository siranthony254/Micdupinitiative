-- ============================================
-- CREATE MIC'D UP INITIATIVE AUTHOR
-- ============================================

-- Check if author exists first
SELECT * FROM public.blog_authors WHERE name = 'Mic''d Up Initiative';

-- Insert the author if it doesn't exist
INSERT INTO public.blog_authors (
  id, 
  name, 
  bio, 
  avatar_url, 
  twitter, 
  linkedin
) 
SELECT 
  uuid_generate_v4(),
  'Mic''d Up Initiative',
  'Mic''d Up Initiative is a leading organization dedicated to empowering students and fostering leadership development on campus.',
  null,
  null,
  null
WHERE NOT EXISTS (
  SELECT 1 FROM public.blog_authors WHERE name = 'Mic''d Up Initiative'
);

-- Verify the author was created
SELECT id, name FROM public.blog_authors WHERE name = 'Mic''d Up Initiative';
