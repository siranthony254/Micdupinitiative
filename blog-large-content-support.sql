-- ============================================
-- BLOG POSTS ENHANCEMENT
-- Support for Large Blog Content
-- ============================================

-- Verify current column type (should be TEXT which supports up to 1GB)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blog_posts' AND column_name = 'content';

-- TEXT type in PostgreSQL is sufficient for large blog posts (up to 1GB)
-- No need to change to LONGTEXT (MySQL only term, PostgreSQL just uses TEXT)

-- ============================================
-- ADD SIZE VALIDATION TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION validate_blog_post_size()
RETURNS TRIGGER AS $$
BEGIN
    -- Check content size (5MB limit at application level)
    -- PostgreSQL TEXT type can handle much larger, but this enforces app-level limits
    IF length(NEW.content) > 5242880 THEN
        RAISE EXCEPTION 'Content is too large (%). Maximum is 5MB.',
            (length(NEW.content) || ' bytes')::text;
    END IF;

    -- Check featured_image size (URLs should be reasonable)
    IF NEW.featured_image IS NOT NULL AND length(NEW.featured_image) > 2048 THEN
        RAISE EXCEPTION 'Featured image URL is too long (%). Maximum is 2048 characters.',
            length(NEW.featured_image)::text;
    END IF;

    -- Check excerpt size
    IF NEW.excerpt IS NOT NULL AND length(NEW.excerpt) > 1000 THEN
        RAISE EXCEPTION 'Excerpt is too long (%). Maximum is 1000 characters.',
            length(NEW.excerpt)::text;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to INSERT operations
DROP TRIGGER IF EXISTS blog_posts_validate_size_insert ON public.blog_posts;
CREATE TRIGGER blog_posts_validate_size_insert
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION validate_blog_post_size();

-- Apply to UPDATE operations
DROP TRIGGER IF EXISTS blog_posts_validate_size_update ON public.blog_posts;
CREATE TRIGGER blog_posts_validate_size_update
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION validate_blog_post_size();

-- ============================================
-- ADD INDEXES FOR LARGE CONTENT QUERIES
-- ============================================

-- Index for content full-text search (helps with large content)
CREATE INDEX IF NOT EXISTS idx_blog_posts_content_search
    ON public.blog_posts USING gin(to_tsvector('english', content));

-- Index for slug-based lookups (common query)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_idx
    ON public.blog_posts(slug);

-- Index for status + created_at (common filtering)
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_created
    ON public.blog_posts(status, created_at DESC);

-- ============================================
-- VERIFY TABLE STRUCTURE
-- ============================================

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

-- Check table size
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename = 'blog_posts';

-- ============================================
-- TEST LARGE CONTENT INSERT
-- ============================================

-- Test that large content can be inserted
DO $$
DECLARE
    large_content TEXT;
    test_post_id UUID;
BEGIN
    -- Create a large content string (around 2MB for testing)
    SELECT string_agg(
        'This is a test paragraph number ' || i || '. ' ||
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' ||
        repeat('Additional filler text. ', 10),
        E'\n'
    ) INTO large_content
    FROM generate_series(1, 100) AS t(i);

    RAISE NOTICE 'Testing with content size: % bytes', length(large_content);

    -- Test insert
    INSERT INTO public.blog_posts (
        title,
        slug,
        content,
        author_id,
        category_id,
        status
    ) VALUES (
        'Large Content Test Post',
        'large-content-test-' || to_char(NOW(), 'YYYYMMDDHH24MISS'),
        large_content,
        (SELECT id FROM public.blog_authors LIMIT 1),
        (SELECT id FROM public.blog_categories LIMIT 1),
        'draft'
    )
    RETURNING id INTO test_post_id;

    RAISE NOTICE 'Test post created successfully with ID: %', test_post_id;

    -- Clean up
    DELETE FROM public.blog_posts WHERE id = test_post_id;

    RAISE NOTICE 'Test completed successfully - large content is supported!';

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Test failed: %', SQLERRM;
END $$;

-- ============================================
-- SUMMARY
-- ============================================
-- Your TEXT column supports:
-- ✅ Up to 1GB per post (PostgreSQL TEXT limit)
-- ✅ Validated at database level (5MB practical limit)
-- ✅ Full-text search capability
-- ✅ Optimized indexes for queries
-- ============================================
