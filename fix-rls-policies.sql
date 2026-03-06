-- Fix RLS Policies for MUI Portal
-- Run this in Supabase SQL Editor to fix the 500 error

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can insert own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can delete own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can insert enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can update all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can delete enrollments" ON enrollments;

DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can update own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON progress;
DROP POLICY IF EXISTS "Admins can insert progress" ON progress;
DROP POLICY IF EXISTS "Admins can update all progress" ON progress;
DROP POLICY IF EXISTS "Admins can delete progress" ON progress;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Recreate policies for enrollments
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON enrollments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own enrollments" ON enrollments
  FOR DELETE USING (auth.uid() = user_id);

-- Recreate policies for progress
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (override RLS for admins)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all enrollments" ON enrollments
  FOR SELECT USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert enrollments" ON enrollments
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all enrollments" ON enrollments
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete enrollments" ON enrollments
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all progress" ON progress
  FOR SELECT USING (
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can insert progress" ON progress
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all progress" ON progress
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete progress" ON progress
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
