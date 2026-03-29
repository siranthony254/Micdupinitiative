-- ============================================
-- FIX FOR AUTHOR_ID NULL CONSTRAINT VIOLATION
-- ============================================

-- Option 1: Set default value to auth.uid() for author_id
-- This ensures that if author_id is not provided, it defaults to the current authenticated user

ALTER TABLE public.blog_posts 
ALTER COLUMN author_id 
SET DEFAULT auth.uid();

-- Option 2: Add a trigger to automatically set author_id to current user if null
CREATE OR REPLACE FUNCTION set_author_id_if_null()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.author_id IS NULL THEN
        NEW.author_id = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the trigger
DROP TRIGGER IF EXISTS blog_posts_set_author_id ON public.blog_posts;
CREATE TRIGGER blog_posts_set_author_id
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION set_author_id_if_null();

-- Update existing posts that have null author_id (if any)
UPDATE public.blog_posts 
SET author_id = (
    SELECT id FROM public.blog_authors 
    WHERE name = 'Mic''d Up Initiative' 
    LIMIT 1
) 
WHERE author_id IS NULL;

-- Add a check to ensure author_id is always valid
ALTER TABLE public.blog_posts 
ADD CONSTRAINT valid_author_id 
CHECK (author_id IS NOT NULL);

-- Note: Choose either Option 1 (default) or Option 2 (trigger), not both.
-- Option 1 is simpler and recommended for this use case.
