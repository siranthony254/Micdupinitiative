-- ============================================
-- COMPLETE FIX FOR BLOG_POSTS CONSTRAINT VIOLATIONS
-- ============================================

-- Check current table structure
SELECT column_name, is_nullable, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================
-- IDENTIFIED NOT NULL CONSTRAINTS:
-- - title (TEXT NOT NULL)
-- - slug (TEXT NOT NULL UNIQUE) 
-- - content (TEXT NOT NULL)
-- - author_id (UUID NOT NULL)
-- - category_id (UUID NOT NULL)
-- ============================================

-- Fix 1: Set proper default for author_id only (category_id will be handled in trigger)
ALTER TABLE public.blog_posts 
ALTER COLUMN author_id 
SET DEFAULT auth.uid();

-- Note: category_id cannot have a dynamic default, so we'll handle it in the trigger
-- The trigger will automatically set category_id to the first available category

-- Fix 2: Add a comprehensive trigger to handle all required fields
CREATE OR REPLACE FUNCTION validate_blog_post_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure author_id is set
    IF NEW.author_id IS NULL THEN
        NEW.author_id := auth.uid();
    END IF;
    
    -- Ensure category_id is set (use first available if null)
    IF NEW.category_id IS NULL THEN
        SELECT id INTO NEW.category_id 
        FROM public.blog_categories 
        LIMIT 1;
    END IF;
    
    -- Validate required fields are not null
    IF NEW.title IS NULL OR NEW.title = '' THEN
        RAISE EXCEPTION 'title cannot be null or empty';
    END IF;
    
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        RAISE EXCEPTION 'slug cannot be null or empty';
    END IF;
    
    IF NEW.content IS NULL OR NEW.content = '' THEN
        RAISE EXCEPTION 'content cannot be null or empty';
    END IF;
    
    IF NEW.author_id IS NULL THEN
        RAISE EXCEPTION 'author_id cannot be null';
    END IF;
    
    IF NEW.category_id IS NULL THEN
        RAISE EXCEPTION 'category_id cannot be null';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the trigger
DROP TRIGGER IF EXISTS blog_posts_validate_data ON public.blog_posts;
CREATE TRIGGER blog_posts_validate_data
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION validate_blog_post_data();

-- Fix 3: Update any existing posts with null values
UPDATE public.blog_posts 
SET author_id = (
    SELECT id FROM public.blog_authors 
    WHERE name = 'Mic''d Up Initiative' 
    LIMIT 1
) 
WHERE author_id IS NULL;

UPDATE public.blog_posts 
SET category_id = (
    SELECT id FROM public.blog_categories 
    LIMIT 1
) 
WHERE category_id IS NULL;

-- Fix 4: Add comprehensive constraints (remove IF NOT EXISTS as it's not supported for constraints)
ALTER TABLE public.blog_posts 
ADD CONSTRAINT valid_title 
CHECK (title IS NOT NULL AND length(trim(title)) > 0);

ALTER TABLE public.blog_posts 
ADD CONSTRAINT valid_slug 
CHECK (slug IS NOT NULL AND length(trim(slug)) > 0);

ALTER TABLE public.blog_posts 
ADD CONSTRAINT valid_content 
CHECK (content IS NOT NULL AND length(trim(content)) > 0);

ALTER TABLE public.blog_posts 
ADD CONSTRAINT valid_author_id 
CHECK (author_id IS NOT NULL);

ALTER TABLE public.blog_posts 
ADD CONSTRAINT valid_category_id 
CHECK (category_id IS NOT NULL);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check for any remaining null values in required columns
SELECT 
    COUNT(*) as total_posts,
    COUNT(CASE WHEN title IS NULL OR title = '' THEN 1 END) as missing_title,
    COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as missing_slug,
    COUNT(CASE WHEN content IS NULL OR content = '' THEN 1 END) as missing_content,
    COUNT(CASE WHEN author_id IS NULL THEN 1 END) as missing_author_id,
    COUNT(CASE WHEN category_id IS NULL THEN 1 END) as missing_category_id
FROM public.blog_posts;

-- Verify the trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_condition,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'blog_posts_validate_data'
AND event_object_table = 'blog_posts';

-- ============================================
-- SUMMARY
-- ============================================
-- This script ensures:
-- ✅ All NOT NULL constraints are properly handled
-- ✅ author_id defaults to current authenticated user
-- ✅ category_id defaults to first available category
-- ✅ Comprehensive validation before insert
-- ✅ Fixes any existing data issues
-- ✅ Prevents future constraint violations
