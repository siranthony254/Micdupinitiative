-- MUI Portal Database Schema
-- Learning + Cohort Platform for Campus Initiative

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cohorts table
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  secret_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cohort lessons (many-to-many relationship)
CREATE TABLE IF NOT EXISTS cohort_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cohort_id, lesson_id)
);

-- User enrollments in cohorts
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cohort_id)
);

-- Progress tracking
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_cohort_lessons_cohort_id ON cohort_lessons(cohort_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_cohort_id ON enrollments(cohort_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress(completed);

-- Row Level Security (RLS) - Simplified to avoid recursion
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses RLS policies
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Lessons RLS policies
CREATE POLICY "Anyone can view lessons" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage lessons" ON lessons
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Cohorts RLS policies
CREATE POLICY "Anyone can view cohorts" ON cohorts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cohorts" ON cohorts
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Cohort Lessons RLS policies
CREATE POLICY "Anyone can view cohort lessons" ON cohort_lessons
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cohort lessons" ON cohort_lessons
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Enrollments RLS policies
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own enrollments" ON enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own enrollments" ON enrollments
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all enrollments" ON enrollments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Progress RLS policies
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own progress" ON progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress" ON progress
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Functions for progress calculation
CREATE OR REPLACE FUNCTION calculate_course_progress(user_uuid UUID, course_uuid UUID)
RETURNS FLOAT AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage FLOAT;
BEGIN
  -- Count total lessons in the course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE course_id = course_uuid;
  
  -- Return 0 if no lessons
  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;
  
  -- Count completed lessons by the user
  SELECT COUNT(*) INTO completed_lessons
  FROM progress
  WHERE user_id = user_uuid
    AND lesson_id IN (
      SELECT id FROM lessons WHERE course_id = course_uuid
    )
    AND completed = TRUE;
  
  -- Calculate percentage
  progress_percentage := (completed_lessons::FLOAT / total_lessons::FLOAT) * 100;
  
  RETURN ROUND(progress_percentage, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_cohort_progress(user_uuid UUID, cohort_uuid UUID)
RETURNS FLOAT AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage FLOAT;
BEGIN
  -- Count total lessons in the cohort
  SELECT COUNT(*) INTO total_lessons
  FROM cohort_lessons
  WHERE cohort_id = cohort_uuid;
  
  -- Return 0 if no lessons
  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;
  
  -- Count completed lessons by the user
  SELECT COUNT(*) INTO completed_lessons
  FROM progress
  WHERE user_id = user_uuid
    AND lesson_id IN (
      SELECT lesson_id FROM cohort_lessons WHERE cohort_id = cohort_uuid
    )
    AND completed = TRUE;
  
  -- Calculate percentage
  progress_percentage := (completed_lessons::FLOAT / total_lessons::FLOAT) * 100;
  
  RETURN ROUND(progress_percentage, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO courses (title, description) VALUES 
-- ('Camera Training', 'Learn the fundamentals of camera operation and photography'),
-- ('Audio Production', 'Master the art of audio recording and production'),
-- ('Media Ethics', 'Understanding ethical considerations in media production');

-- INSERT INTO lessons (course_id, title, content, order_index) VALUES 
-- ((SELECT id FROM courses WHERE title = 'Camera Training' LIMIT 1), 
--  'Introduction to Cameras', 'Basic camera concepts and terminology', 1),
-- ((SELECT id FROM courses WHERE title = 'Camera Training' LIMIT 1), 
--  'Camera Controls', 'Understanding aperture, ISO, and shutter speed', 2);

-- INSERT INTO cohorts (name, description, secret_key) VALUES 
-- ('Fall 2024 Media Cohort', 'Comprehensive media training for fall semester', 'FALL2024'),
-- ('Advanced Camera Workshop', 'Intensive camera skills development', 'CAMERA2024');
