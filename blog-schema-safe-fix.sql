-- ============================================
-- SAFE VERSION - CHECKS FOR EXISTING CONSTRAINTS
-- ============================================

-- Fix 4: Add comprehensive constraints (safe version)
DO $$
BEGIN
    -- Add valid_title constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_title' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE public.blog_posts 
        ADD CONSTRAINT valid_title 
        CHECK (title IS NOT NULL AND length(trim(title)) > 0);
        RAISE NOTICE 'Added valid_title constraint';
    END IF;

    -- Add valid_slug constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_slug' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE public.blog_posts 
        ADD CONSTRAINT valid_slug 
        CHECK (slug IS NOT NULL AND length(trim(slug)) > 0);
        RAISE NOTICE 'Added valid_slug constraint';
    END IF;

    -- Add valid_content constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_content' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE public.blog_posts 
        ADD CONSTRAINT valid_content 
        CHECK (content IS NOT NULL AND length(trim(content)) > 0);
        RAISE NOTICE 'Added valid_content constraint';
    END IF;

    -- Add valid_author_id constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_author_id' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE public.blog_posts 
        ADD CONSTRAINT valid_author_id 
        CHECK (author_id IS NOT NULL);
        RAISE NOTICE 'Added valid_author_id constraint';
    END IF;

    -- Add valid_category_id constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_category_id' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE public.blog_posts 
        ADD CONSTRAINT valid_category_id 
        CHECK (category_id IS NOT NULL);
        RAISE NOTICE 'Added valid_category_id constraint';
    END IF;
END $$;

-- ============================================
-- ALTERNATIVE: SIMPLER VERSION WITHOUT CONSTRAINTS
-- ============================================

-- If you prefer to skip the constraints and just rely on the trigger,
-- you can run this simpler version instead:

/*
-- Set defaults only
ALTER TABLE public.blog_posts 
ALTER COLUMN author_id 
SET DEFAULT auth.uid();

-- Add trigger only
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

DROP TRIGGER IF EXISTS blog_posts_validate_data ON public.blog_posts;
CREATE TRIGGER blog_posts_validate_data
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION validate_blog_post_data();
*/
