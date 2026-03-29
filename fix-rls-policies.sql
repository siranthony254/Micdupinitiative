-- ============================================
-- FIX ROW LEVEL SECURITY POLICIES
-- ============================================

-- 1. Fix blog_categories policies
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert categories
CREATE POLICY "Allow authenticated users to insert categories"
ON blog_categories
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow reading categories
CREATE POLICY "Allow public read categories"
ON blog_categories
FOR SELECT
USING (true);

-- Allow updating categories (for admins)
CREATE POLICY "Allow authenticated users to update categories"
ON blog_categories
FOR UPDATE
TO authenticated
USING (true);

-- Allow deleting categories (for admins)
CREATE POLICY "Allow authenticated users to delete categories"
ON blog_categories
FOR DELETE
TO authenticated
USING (true);

-- 2. Fix blog_authors policies
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert authors
CREATE POLICY "Allow authenticated insert authors"
ON blog_authors
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow read authors
CREATE POLICY "Allow read authors"
ON blog_authors
FOR SELECT
USING (true);

-- Allow updating authors
CREATE POLICY "Allow authenticated users to update authors"
ON blog_authors
FOR UPDATE
TO authenticated
USING (true);

-- Allow deleting authors
CREATE POLICY "Allow authenticated users to delete authors"
ON blog_authors
FOR DELETE
TO authenticated
USING (true);

-- 3. Fix blog_posts policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert posts
CREATE POLICY "Allow authenticated users to insert posts"
ON blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow reading published posts
CREATE POLICY "Allow public read published posts"
ON blog_posts
FOR SELECT
USING (status = 'published');

-- Allow authenticated users to read all posts
CREATE POLICY "Allow authenticated read all posts"
ON blog_posts
FOR SELECT
TO authenticated
USING (true);

-- Allow updating posts
CREATE POLICY "Allow authenticated users to update posts"
ON blog_posts
FOR UPDATE
TO authenticated
USING (true);

-- Allow deleting posts
CREATE POLICY "Allow authenticated users to delete posts"
ON blog_posts
FOR DELETE
TO authenticated
USING (true);

-- 4. Fix blog_tags policies
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert tags
CREATE POLICY "Allow authenticated users to insert tags"
ON blog_tags
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow reading tags
CREATE POLICY "Allow public read tags"
ON blog_tags
FOR SELECT
USING (true);

-- Allow updating tags
CREATE POLICY "Allow authenticated users to update tags"
ON blog_tags
FOR UPDATE
TO authenticated
USING (true);

-- Allow deleting tags
CREATE POLICY "Allow authenticated users to delete tags"
ON blog_tags
FOR DELETE
TO authenticated
USING (true);

-- 5. Fix blog_post_tags (junction table) policies
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert post-tag relations
CREATE POLICY "Allow authenticated users to insert post_tags"
ON blog_post_tags
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow reading post-tag relations
CREATE POLICY "Allow public read post_tags"
ON blog_post_tags
FOR SELECT
USING (true);

-- Allow deleting post-tag relations
CREATE POLICY "Allow authenticated users to delete post_tags"
ON blog_post_tags
FOR DELETE
TO authenticated
USING (true);
