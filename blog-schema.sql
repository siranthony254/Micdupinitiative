-- ============================================
-- BLOG SYSTEM - PRODUCTION DATABASE SCHEMA
-- Enhanced Blog Platform for MUI Portal
-- ============================================

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. BLOG AUTHORS
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  twitter TEXT,
  linkedin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. BLOG CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. BLOG TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID NOT NULL REFERENCES public.blog_authors(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT FALSE,
  read_time INTEGER DEFAULT 5, -- estimated reading time in minutes
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ============================================
-- 5. POST-TAGS RELATIONSHIP (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- ============================================
-- 6. BLOG COMMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE, -- for threaded comments
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. BLOG ANALYTICS
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'share', 'comment')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata JSONB, -- additional data like referrer, device, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. BLOG NEWSLETTER
-- ============================================
CREATE TABLE IF NOT EXISTS public.blog_newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON public.blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON public.blog_posts(views DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON public.blog_posts USING gin(to_tsvector('english', title || ' ' || content));

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON public.blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created ON public.blog_comments(created_at DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_blog_analytics_post ON public.blog_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_type ON public.blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_created ON public.blog_analytics(created_at DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_blog_authors_updated_at BEFORE UPDATE ON public.blog_authors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_tags_updated_at BEFORE UPDATE ON public.blog_tags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON public.blog_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_newsletter_updated_at BEFORE UPDATE ON public.blog_newsletter 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_newsletter ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Comments policies
CREATE POLICY "Approved comments are viewable by everyone" ON public.blog_comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create comments" ON public.blog_comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all comments" ON public.blog_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Analytics policies
CREATE POLICY "Users can create analytics" ON public.blog_analytics
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view analytics" ON public.blog_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Newsletter policies
CREATE POLICY "Everyone can view newsletter" ON public.blog_newsletter
    FOR SELECT USING (true);

CREATE POLICY "Everyone can subscribe to newsletter" ON public.blog_newsletter
    FOR INSERT WITH CHECK (true);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert MUI-specific categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Student Life', 'student-life', 'Stories and experiences from campus life, dorm living, and student activities'),
('Voice and Communication', 'voice-and-communication', 'Public speaking, presentation skills, and finding your voice'),
('Leadership', 'leadership', 'Leadership development, campus influence, and making an impact'),
('Creativity and Media', 'creativity-and-media', 'Creative expression, media production, and digital storytelling'),
('Career and Future', 'career-and-future', 'Career planning, professional development, and future opportunities'),
('MUI Stories', 'mui-stories', 'Success stories, testimonials, and experiences from the MUI community')
ON CONFLICT (slug) DO NOTHING;

-- Insert default MUI author
INSERT INTO public.blog_authors (name, bio, avatar_url) VALUES
('Mic''d Up Initiative', 'The official voice of Mic''d Up Initiative, amplifying campus conversations and powerful ideas from across African universities.', '/images/mui-logo.png')
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Published posts with author and category info
CREATE OR REPLACE VIEW public.published_posts AS
SELECT 
    bp.*,
    ba.name as author_name,
    ba.avatar_url as author_avatar,
    ba.twitter as author_twitter,
    ba.linkedin as author_linkedin,
    bc.name as category_name,
    bc.slug as category_slug,
    bc.description as category_description
FROM public.blog_posts bp
LEFT JOIN public.blog_authors ba ON bp.author_id = ba.id
LEFT JOIN public.blog_categories bc ON bp.category_id = bc.id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC;

-- Posts with tags
CREATE OR REPLACE VIEW public.posts_with_tags AS
SELECT 
    pp.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', bt.id,
                'name', bt.name,
                'slug', bt.slug
            )
        ) FILTER (WHERE bt.id IS NOT NULL), 
        '[]'::json
    ) as tags
FROM public.published_posts pp
LEFT JOIN public.blog_post_tags bpt ON pp.id = bpt.post_id
LEFT JOIN public.blog_tags bt ON bpt.tag_id = bt.id
GROUP BY pp.id, pp.title, pp.subtitle, pp.slug, pp.content, pp.excerpt, pp.featured_image, 
         pp.author_id, pp.category_id, pp.status, pp.featured, pp.read_time, pp.views,
         pp.created_at, pp.updated_at, pp.published_at, pp.author_name, pp.author_avatar,
         pp.author_twitter, pp.author_linkedin, pp.category_name, pp.category_slug, pp.category_description;

-- ============================================
-- FUNCTIONS FOR REAL-TIME UPDATES
-- ============================================

-- Increment view count
CREATE OR REPLACE FUNCTION increment_post_view(post_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blog_posts 
    SET views = views + 1 
    WHERE id = post_uuid;
    
    -- Track analytics
    INSERT INTO public.blog_analytics (post_id, event_type, user_id, metadata)
    VALUES (post_uuid, 'view', auth.uid(), jsonb_build_object('timestamp', NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get related posts
CREATE OR REPLACE FUNCTION get_related_posts(post_uuid UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image TEXT,
    category_name TEXT,
    category_slug TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH same_category AS (
        SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
               bc.name as category_name, bc.slug as category_slug,
               1 as relevance_score
        FROM public.blog_posts bp
        JOIN public.blog_categories bc ON bp.category_id = bc.id
        WHERE bp.category_id = (SELECT category_id FROM public.blog_posts WHERE id = post_uuid)
        AND bp.id != post_uuid
        AND bp.status = 'published'
        LIMIT limit_count
    ),
    shared_tags AS (
        SELECT DISTINCT bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
               bc.name as category_name, bc.slug as category_slug,
               COUNT(bt.id) as relevance_score
        FROM public.blog_posts bp
        JOIN public.blog_post_tags bpt ON bp.id = bpt.post_id
        JOIN public.blog_tags bt ON bpt.tag_id = bt.id
        JOIN public.blog_categories bc ON bp.category_id = bc.id
        WHERE bpt.tag_id IN (
            SELECT tag_id FROM public.blog_post_tags WHERE post_id = post_uuid
        )
        AND bp.id != post_uuid
        AND bp.status = 'published'
        GROUP BY bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image, bc.name, bc.slug
        ORDER BY relevance_score DESC
        LIMIT limit_count
    )
    SELECT * FROM same_category
    UNION
    SELECT * FROM shared_tags
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REAL-TIME SUBSCRIPTIONS
-- ============================================

-- Enable real-time for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_tags;

-- ============================================
-- SUMMARY
-- ============================================
-- 
-- This schema provides:
-- ✅ Complete blog system with posts, authors, categories, tags
-- ✅ Real-time updates via Supabase subscriptions
-- ✅ Performance optimizations with indexes and views
-- ✅ Analytics tracking for views, shares, comments
-- ✅ Row-level security for public/admin access
-- ✅ Newsletter subscription system
-- ✅ Related posts functionality
-- ✅ Full-text search capabilities
-- ✅ MUI-specific categories and content
-- 
-- Ready for production deployment with Next.js app router!
--
