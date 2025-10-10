-- Assessment Database Schema - Simplified Version
-- This creates the core tables needed for the assessment system

-- Create users table (simplified for MVP)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert mock user for testing
INSERT INTO users (id, email, name, role)
VALUES ('mock-user-123', 'test@example.com', 'Test User', 'employee')
ON CONFLICT (id) DO NOTHING;

-- User Assessments
CREATE TABLE IF NOT EXISTS user_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_step VARCHAR(50) NOT NULL,
  completed_steps TEXT[],
  percent_complete INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_percentage CHECK (percent_complete >= 0 AND percent_complete <= 100)
);

CREATE INDEX IF NOT EXISTS idx_user_assessments_user_id ON user_assessments(user_id);

-- Cultural Backgrounds
CREATE TABLE IF NOT EXISTS cultural_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES user_assessments(id) ON DELETE CASCADE,
  country_of_origin VARCHAR(100) NOT NULL,
  primary_language VARCHAR(100) NOT NULL,
  english_proficiency INTEGER NOT NULL CHECK (english_proficiency BETWEEN 1 AND 5),
  years_in_target_country INTEGER DEFAULT 0,
  previous_international_experience BOOLEAN DEFAULT FALSE,
  cultural_adaptation_concerns TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cultural_backgrounds_assessment_id ON cultural_backgrounds(assessment_id);

-- Skill Ratings
CREATE TABLE IF NOT EXISTS skill_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  rating_value INTEGER NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_ratings_assessment_id ON skill_ratings(assessment_id);

-- Learning Preferences
CREATE TABLE IF NOT EXISTS learning_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,
  primary_style VARCHAR(50) NOT NULL,
  secondary_style VARCHAR(50),
  preferred_content_types TEXT[],
  time_commitment VARCHAR(50),
  notification_frequency VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_preferences_assessment_id ON learning_preferences(assessment_id);

-- Learning Paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES user_assessments(id) ON DELETE SET NULL,
  path_name VARCHAR(255) NOT NULL,
  path_description TEXT,
  overall_score INTEGER,
  cultural_competency_score INTEGER,
  skills_score INTEGER,
  estimated_completion_weeks INTEGER,
  difficulty_level VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_is_active ON learning_paths(is_active);

-- Priority Areas
CREATE TABLE IF NOT EXISTS priority_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  category VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  importance VARCHAR(50),
  current_level INTEGER,
  target_level INTEGER,
  estimated_time_weeks INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  priority_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_priority_areas_learning_path_id ON priority_areas(learning_path_id);

-- Recommended Courses
CREATE TABLE IF NOT EXISTS recommended_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  course_description TEXT,
  category VARCHAR(100),
  duration_minutes INTEGER,
  difficulty_level VARCHAR(50),
  content_types TEXT[],
  priority_order INTEGER,
  is_required BOOLEAN DEFAULT FALSE,
  is_enrolled BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommended_courses_learning_path_id ON recommended_courses(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_recommended_courses_course_id ON recommended_courses(course_id);

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  milestone_type VARCHAR(50),
  target_date TIMESTAMP WITH TIME ZONE,
  scheduled_week INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  milestone_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_learning_path_id ON milestones(learning_path_id);

-- Success message
SELECT 'Database schema created successfully!' as status;
