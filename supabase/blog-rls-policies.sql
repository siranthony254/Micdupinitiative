-- Blog System RLS Policies
-- Run these in Supabase SQL Editor to fix permission issues

-- 1. Enable RLS on blog tables if not already enabled
ALTER TABLE blog_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- 2. Blog Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own blog profile" ON blog_profiles
  FOR SELECT USING (auth.uid() = id::uuid);

-- Users can insert their own profile
CREATE POLICY "Users can insert own blog profile" ON blog_profiles
  FOR INSERT WITH CHECK (auth.uid() = id::uuid);

-- Users can update their own profile
CREATE POLICY "Users can update own blog profile" ON blog_profiles
  FOR UPDATE USING (auth.uid() = id::uuid);

-- Admins can manage all blog profiles
CREATE POLICY "Admins can manage all blog profiles" ON blog_profiles
  FOR ALL USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'admin@muiportal.com',
      'officialsiranthony@gmail.com'
    ])
  );

-- 3. Blog Posts Policies
-- Everyone can view published posts
CREATE POLICY "Everyone can view published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Authors can view their own posts
CREATE POLICY "Authors can view own posts" ON blog_posts
  FOR SELECT USING (auth.uid() = author_id::uuid);

-- Authors can create posts
CREATE POLICY "Authors can create posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id::uuid);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = author_id::uuid);

-- Admins can manage all posts
CREATE POLICY "Admins can manage all posts" ON blog_posts
  FOR ALL USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'admin@muiportal.com',
      'officialsiranthony@gmail.com'
    ])
  );

-- 4. Blog Categories Policies
-- Everyone can view categories
CREATE POLICY "Everyone can view categories" ON blog_categories
  FOR SELECT USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories" ON blog_categories
  FOR ALL USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'admin@muiportal.com',
      'officialsiranthony@gmail.com'
    ])
  );

-- 5. Blog Tags Policies
-- Everyone can view tags
CREATE POLICY "Everyone can view tags" ON blog_tags
  FOR SELECT USING (true);

-- Admins can manage tags
CREATE POLICY "Admins can manage tags" ON blog_tags
  FOR ALL USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'admin@muiportal.com',
      'officialsiranthony@gmail.com'
    ])
  );

-- 6. Blog Post Tags Policies
-- Everyone can view post-tag relationships
CREATE POLICY "Everyone can view post tags" ON blog_post_tags
  FOR SELECT USING (true);

-- Authors can manage their own post tags
CREATE POLICY "Authors can manage own post tags" ON blog_post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE blog_posts.id = blog_post_tags.post_id 
      AND blog_posts.author_id::uuid = auth.uid()
    )
  );

-- Admins can manage all post tags
CREATE POLICY "Admins can manage all post tags" ON blog_post_tags
  FOR ALL USING (
    auth.jwt() ->> 'email' = ANY(ARRAY[
      'admin@muiportal.com',
      'officialsiranthony@gmail.com'
    ])
  );

-- 7. Create Functions for Admin Check
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('admin@muiportal.com', 'officialsiranthony@gmail.com')
  );
END;
$$;

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON blog_profiles TO authenticated;
GRANT ALL ON blog_posts TO authenticated;
GRANT SELECT ON blog_categories TO authenticated;
GRANT SELECT ON blog_tags TO authenticated;
GRANT ALL ON blog_post_tags TO authenticated;

-- 9. Create blog profile for existing users if it doesn't exist
CREATE OR REPLACE FUNCTION create_blog_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO blog_profiles (id, full_name, email, role)
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'author'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create blog profile
CREATE OR REPLACE TRIGGER create_blog_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_blog_profile();
