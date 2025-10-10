# Assessment Database Schema

This document outlines the database schema for the User Assessment and Learning Path system.

## Overview

The assessment system tracks:
- User onboarding assessments
- Cultural competency evaluations
- Skills gap analysis
- Learning preferences
- Personalized learning paths
- Progress tracking
- 90-day review cycles

## Database Tables

### 1. `user_assessments`

Primary table for storing assessment responses and state.

```sql
CREATE TABLE user_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Assessment metadata
  assessment_type VARCHAR(50) NOT NULL DEFAULT 'onboarding', -- 'onboarding', 'review', 'skills_update'
  version VARCHAR(10) NOT NULL DEFAULT '1.0', -- Track assessment version for analytics

  -- Progress tracking
  current_step VARCHAR(50) NOT NULL,
  completed_steps TEXT[], -- Array of completed step IDs
  total_steps INTEGER NOT NULL DEFAULT 6,
  percent_complete INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Completion status
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  is_valid BOOLEAN NOT NULL DEFAULT TRUE, -- For invalidating old assessments

  -- Indexes for common queries
  CONSTRAINT valid_percentage CHECK (percent_complete >= 0 AND percent_complete <= 100)
);

CREATE INDEX idx_user_assessments_user_id ON user_assessments(user_id);
CREATE INDEX idx_user_assessments_completed_at ON user_assessments(completed_at);
CREATE INDEX idx_user_assessments_is_completed ON user_assessments(is_completed);
```

### 2. `assessment_responses`

Stores individual responses to assessment questions.

```sql
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,

  -- Question identification
  step_id VARCHAR(50) NOT NULL, -- 'role', 'cultural', 'skills', etc.
  question_id VARCHAR(100), -- Optional for specific questions
  question_category VARCHAR(50), -- 'cultural', 'technical', 'preference', etc.

  -- Response data (JSON for flexibility)
  response_value JSONB NOT NULL,

  -- Metadata
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  time_spent_seconds INTEGER, -- Time spent on this question

  -- Analytics
  confidence_level INTEGER, -- 1-5 scale for user confidence (optional)
  changed_count INTEGER DEFAULT 0 -- Track how many times user changed answer
);

CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX idx_assessment_responses_step_id ON assessment_responses(step_id);
CREATE INDEX idx_assessment_responses_question_category ON assessment_responses(question_category);
CREATE INDEX idx_assessment_responses_gin_response ON assessment_responses USING gin(response_value);
```

### 3. `cultural_backgrounds`

Detailed cultural background information.

```sql
CREATE TABLE cultural_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES user_assessments(id) ON DELETE SET NULL,

  -- Cultural information
  country_of_origin VARCHAR(100) NOT NULL,
  primary_language VARCHAR(100) NOT NULL,
  english_proficiency INTEGER NOT NULL CHECK (english_proficiency BETWEEN 1 AND 5),
  years_in_target_country INTEGER DEFAULT 0,
  previous_international_experience BOOLEAN DEFAULT FALSE,

  -- Concerns and preferences
  cultural_adaptation_concerns TEXT[],
  preferred_cultural_resources TEXT[],

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_user_cultural_background UNIQUE(user_id)
);

CREATE INDEX idx_cultural_backgrounds_country ON cultural_backgrounds(country_of_origin);
CREATE INDEX idx_cultural_backgrounds_language ON cultural_backgrounds(primary_language);
```

### 4. `skills_assessments`

Skills evaluation and gap analysis.

```sql
CREATE TABLE skills_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Role information
  user_role VARCHAR(50) NOT NULL, -- 'nurse', 'physician', etc.

  -- Overall scores
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),

  -- Metadata
  assessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  next_assessment_due TIMESTAMP WITH TIME ZONE,

  CONSTRAINT unique_assessment_skills UNIQUE(assessment_id)
);

CREATE INDEX idx_skills_assessments_user_id ON skills_assessments(user_id);
CREATE INDEX idx_skills_assessments_role ON skills_assessments(user_role);
```

### 5. `skill_ratings`

Individual skill ratings within an assessment.

```sql
CREATE TABLE skill_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skills_assessment_id UUID NOT NULL REFERENCES skills_assessments(id) ON DELETE CASCADE,

  -- Skill identification
  skill_category VARCHAR(100) NOT NULL, -- 'clinical', 'technical', 'communication', etc.
  skill_name VARCHAR(200) NOT NULL,
  skill_description TEXT,

  -- Rating
  current_level INTEGER NOT NULL CHECK (current_level BETWEEN 1 AND 5),
  target_level INTEGER NOT NULL CHECK (target_level BETWEEN 1 AND 5),

  -- Gap analysis
  gap_size INTEGER GENERATED ALWAYS AS (target_level - current_level) STORED,
  priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'

  -- Metadata
  rated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skill_ratings_assessment_id ON skill_ratings(skills_assessment_id);
CREATE INDEX idx_skill_ratings_category ON skill_ratings(skill_category);
CREATE INDEX idx_skill_ratings_gap ON skill_ratings(gap_size);
CREATE INDEX idx_skill_ratings_priority ON skill_ratings(priority);
```

### 6. `learning_preferences`

User learning style and preferences.

```sql
CREATE TABLE learning_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES user_assessments(id) ON DELETE SET NULL,

  -- Learning styles
  primary_style VARCHAR(50) NOT NULL, -- 'visual', 'auditory', 'reading-writing', 'kinesthetic'
  secondary_style VARCHAR(50),

  -- Content preferences
  preferred_content_types TEXT[], -- ['video', 'reading', 'interactive', 'quiz']

  -- Time management
  time_commitment VARCHAR(20) NOT NULL, -- 'light', 'moderate', 'intensive'
  scheduling_preference VARCHAR(20) DEFAULT 'flexible', -- 'flexible', 'structured'

  -- Notifications
  notification_frequency VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'biweekly', 'monthly'
  notification_channels TEXT[] DEFAULT ARRAY['email', 'in-app'],
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_user_learning_prefs UNIQUE(user_id)
);

CREATE INDEX idx_learning_prefs_primary_style ON learning_preferences(primary_style);
CREATE INDEX idx_learning_prefs_time_commitment ON learning_preferences(time_commitment);
```

### 7. `learning_paths`

Personalized learning paths generated from assessments.

```sql
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,

  -- Path metadata
  path_name VARCHAR(200) NOT NULL,
  path_description TEXT,

  -- Scores summary
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  cultural_competency_score INTEGER CHECK (cultural_competency_score BETWEEN 0 AND 100),
  skills_score INTEGER CHECK (skills_score BETWEEN 0 AND 100),

  -- Path configuration
  estimated_completion_weeks INTEGER,
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'on_hold', 'abandoned'

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT unique_active_path_per_user UNIQUE(user_id, is_active) WHERE is_active = TRUE
);

CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_status ON learning_paths(status);
CREATE INDEX idx_learning_paths_created_at ON learning_paths(created_at);
```

### 8. `priority_areas`

Focus areas within a learning path.

```sql
CREATE TABLE priority_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,

  -- Area details
  category VARCHAR(50) NOT NULL, -- 'cultural', 'technical', 'language', 'compliance'
  title VARCHAR(200) NOT NULL,
  description TEXT,

  -- Importance and progress
  importance VARCHAR(20) NOT NULL, -- 'critical', 'high', 'medium', 'low'
  current_level INTEGER CHECK (current_level BETWEEN 0 AND 100),
  target_level INTEGER CHECK (target_level BETWEEN 0 AND 100),

  -- Time estimation
  estimated_time_weeks INTEGER,

  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Order
  priority_order INTEGER NOT NULL,

  CONSTRAINT unique_path_priority_order UNIQUE(learning_path_id, priority_order)
);

CREATE INDEX idx_priority_areas_learning_path ON priority_areas(learning_path_id);
CREATE INDEX idx_priority_areas_category ON priority_areas(category);
CREATE INDEX idx_priority_areas_importance ON priority_areas(importance);
```

### 9. `recommended_courses`

Course recommendations linked to learning paths.

```sql
CREATE TABLE recommended_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,

  -- Course reference (could link to a courses table if exists)
  course_id UUID, -- Reference to actual course if exists
  course_title VARCHAR(200) NOT NULL,
  course_description TEXT,

  -- Course metadata
  category VARCHAR(100),
  duration_minutes INTEGER,
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  content_types TEXT[], -- ['video', 'reading', 'interactive']

  -- Recommendation details
  priority_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT FALSE,
  prerequisite_course_ids UUID[],

  -- Progress tracking
  is_enrolled BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

  CONSTRAINT unique_path_course_order UNIQUE(learning_path_id, priority_order)
);

CREATE INDEX idx_recommended_courses_path_id ON recommended_courses(learning_path_id);
CREATE INDEX idx_recommended_courses_category ON recommended_courses(category);
CREATE INDEX idx_recommended_courses_difficulty ON recommended_courses(difficulty_level);
CREATE INDEX idx_recommended_courses_completed ON recommended_courses(is_completed);
```

### 10. `milestones`

Learning path milestones for tracking progress.

```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,

  -- Milestone details
  title VARCHAR(200) NOT NULL,
  description TEXT,
  milestone_type VARCHAR(50) DEFAULT 'general', -- 'cultural', 'skills', 'course_completion', 'general'

  -- Scheduling
  target_date DATE,
  scheduled_week INTEGER, -- Week number in the learning path

  -- Associated resources
  associated_course_ids UUID[],
  required_activities TEXT[],

  -- Completion
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Rewards (optional)
  rewards TEXT[],
  badge_awarded VARCHAR(100),

  -- Order
  milestone_order INTEGER NOT NULL,

  CONSTRAINT unique_path_milestone_order UNIQUE(learning_path_id, milestone_order)
);

CREATE INDEX idx_milestones_learning_path ON milestones(learning_path_id);
CREATE INDEX idx_milestones_target_date ON milestones(target_date);
CREATE INDEX idx_milestones_completed ON milestones(is_completed);
```

### 11. `review_cycles`

90-day review cycles for continuous assessment.

```sql
CREATE TABLE review_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,

  -- Cycle information
  cycle_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'overdue'

  -- Initial assessment reference
  initial_assessment_id UUID REFERENCES user_assessments(id),

  -- Final review
  final_assessment_id UUID REFERENCES user_assessments(id),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT unique_user_cycle_number UNIQUE(user_id, cycle_number),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

CREATE INDEX idx_review_cycles_user_id ON review_cycles(user_id);
CREATE INDEX idx_review_cycles_status ON review_cycles(status);
CREATE INDEX idx_review_cycles_dates ON review_cycles(start_date, end_date);
```

### 12. `check_ins`

Periodic check-ins during review cycles.

```sql
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_cycle_id UUID NOT NULL REFERENCES review_cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Check-in timing
  check_in_date DATE NOT NULL,
  days_since_start INTEGER NOT NULL,
  scheduled_week INTEGER, -- Week number in the cycle

  -- Self-assessment
  progress_rating INTEGER CHECK (progress_rating BETWEEN 1 AND 5),
  challenges_faced TEXT[],
  successes_achieved TEXT[],
  support_needed TEXT[],

  -- Metrics
  courses_completed_since_last INTEGER DEFAULT 0,
  hours_spent_learning DECIMAL(5,2) DEFAULT 0,

  -- Notes
  user_notes TEXT,
  admin_notes TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_check_ins_review_cycle ON check_ins(review_cycle_id);
CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX idx_check_ins_date ON check_ins(check_in_date);
```

### 13. `review_summaries`

Summary of completed review cycles.

```sql
CREATE TABLE review_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_cycle_id UUID NOT NULL REFERENCES review_cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Comparison metrics
  initial_cultural_score INTEGER,
  final_cultural_score INTEGER,
  cultural_improvement INTEGER,

  initial_skills_score INTEGER,
  final_skills_score INTEGER,
  skills_improvement INTEGER,

  -- Achievements
  milestones_completed INTEGER DEFAULT 0,
  courses_completed INTEGER DEFAULT 0,
  certifications_earned TEXT[],
  badges_earned TEXT[],

  -- Next steps
  next_cycle_recommendations TEXT[],

  -- Updated learning path
  updated_learning_path_id UUID REFERENCES learning_paths(id),

  -- Metadata
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_review_summary UNIQUE(review_cycle_id)
);

CREATE INDEX idx_review_summaries_user_id ON review_summaries(user_id);
CREATE INDEX idx_review_summaries_completed_at ON review_summaries(completed_at);
```

### 14. `assessment_analytics`

Analytics and aggregate data for assessments.

```sql
CREATE TABLE assessment_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES user_assessments(id) ON DELETE CASCADE,

  -- Completion metrics
  completion_rate INTEGER CHECK (completion_rate BETWEEN 0 AND 100),
  time_spent_seconds INTEGER,
  retake_count INTEGER DEFAULT 0,

  -- Demographic data
  user_role VARCHAR(50),
  country_of_origin VARCHAR(100),

  -- Performance metrics
  cultural_competency_score INTEGER,
  skills_score INTEGER,
  engagement_score INTEGER, -- Based on interaction patterns

  -- Timestamps
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Aggregation period (for trend analysis)
  period_start DATE,
  period_end DATE
);

CREATE INDEX idx_analytics_user_id ON assessment_analytics(user_id);
CREATE INDEX idx_analytics_assessment_id ON assessment_analytics(assessment_id);
CREATE INDEX idx_analytics_role ON assessment_analytics(user_role);
CREATE INDEX idx_analytics_country ON assessment_analytics(country_of_origin);
CREATE INDEX idx_analytics_period ON assessment_analytics(period_start, period_end);
```

### 15. `assessment_reminders`

Notification and reminder system.

```sql
CREATE TABLE assessment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Reminder details
  reminder_type VARCHAR(50) NOT NULL, -- 'review', 'milestone', 'course', 'check_in'
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Delivery
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_channels TEXT[], -- ['email', 'sms', 'push', 'in-app']

  -- Action
  action_url VARCHAR(500),
  action_required BOOLEAN DEFAULT FALSE,

  -- Status
  is_dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP WITH TIME ZONE,

  -- Related entities
  related_assessment_id UUID REFERENCES user_assessments(id),
  related_milestone_id UUID REFERENCES milestones(id),
  related_check_in_id UUID REFERENCES check_ins(id)
);

CREATE INDEX idx_reminders_user_id ON assessment_reminders(user_id);
CREATE INDEX idx_reminders_scheduled_for ON assessment_reminders(scheduled_for);
CREATE INDEX idx_reminders_is_sent ON assessment_reminders(is_sent);
CREATE INDEX idx_reminders_type ON assessment_reminders(reminder_type);
```

## Views

### Active Learning Paths View

```sql
CREATE VIEW v_active_learning_paths AS
SELECT
  lp.id,
  lp.user_id,
  u.email,
  u.full_name,
  lp.path_name,
  lp.overall_score,
  lp.estimated_completion_weeks,
  lp.difficulty_level,
  lp.status,
  COUNT(DISTINCT rc.id) FILTER (WHERE rc.is_completed = false) as incomplete_courses,
  COUNT(DISTINCT m.id) FILTER (WHERE m.is_completed = true) as completed_milestones,
  COUNT(DISTINCT m.id) as total_milestones,
  lp.created_at,
  lp.started_at
FROM learning_paths lp
JOIN users u ON u.id = lp.user_id
LEFT JOIN recommended_courses rc ON rc.learning_path_id = lp.id
LEFT JOIN milestones m ON m.learning_path_id = lp.id
WHERE lp.is_active = TRUE
GROUP BY lp.id, u.email, u.full_name;
```

### User Progress Summary View

```sql
CREATE VIEW v_user_progress_summary AS
SELECT
  u.id as user_id,
  u.email,
  u.full_name,
  lp.id as learning_path_id,
  lp.path_name,
  lp.overall_score,
  COUNT(DISTINCT rc.id) FILTER (WHERE rc.is_completed = true) as courses_completed,
  COUNT(DISTINCT rc.id) as total_courses,
  COUNT(DISTINCT m.id) FILTER (WHERE m.is_completed = true) as milestones_completed,
  COUNT(DISTINCT m.id) as total_milestones,
  COALESCE(AVG(rc.progress_percentage), 0) as average_course_progress,
  lp.created_at as path_created_at,
  MAX(rc.completed_at) as last_course_completed_at
FROM users u
LEFT JOIN learning_paths lp ON lp.user_id = u.id AND lp.is_active = TRUE
LEFT JOIN recommended_courses rc ON rc.learning_path_id = lp.id
LEFT JOIN milestones m ON m.learning_path_id = lp.id
GROUP BY u.id, lp.id;
```

## Functions and Triggers

### Update timestamp trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_cultural_backgrounds_updated_at
    BEFORE UPDATE ON cultural_backgrounds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_preferences_updated_at
    BEFORE UPDATE ON learning_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at
    BEFORE UPDATE ON check_ins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Calculate overall learning path progress

```sql
CREATE OR REPLACE FUNCTION calculate_learning_path_progress(path_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_courses INTEGER;
  completed_courses INTEGER;
  progress_pct INTEGER;
BEGIN
  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_completed = TRUE)
  INTO total_courses, completed_courses
  FROM recommended_courses
  WHERE learning_path_id = path_id;

  IF total_courses = 0 THEN
    RETURN 0;
  END IF;

  progress_pct := (completed_courses * 100) / total_courses;
  RETURN progress_pct;
END;
$$ LANGUAGE plpgsql;
```

## Indexes Summary

All tables have appropriate indexes for:
- Foreign key relationships
- Common query patterns (user_id, status, dates)
- Search operations (GIN indexes for JSONB and array fields)
- Performance optimization

## Row-Level Security (RLS)

Consider implementing RLS policies for multi-tenant security:

```sql
-- Enable RLS on sensitive tables
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only see their own data
CREATE POLICY user_assessments_select_policy ON user_assessments
  FOR SELECT
  USING (user_id = current_user_id());

-- Admin policy: Admins can see all data
CREATE POLICY user_assessments_admin_policy ON user_assessments
  FOR ALL
  USING (is_admin());
```

## Migration Strategy

1. Create tables in dependency order (users → assessments → responses)
2. Add indexes after initial data load for better performance
3. Create views after all tables are created
4. Add triggers last
5. Test with sample data before production deployment

## Backup and Maintenance

- Regular backups of all assessment data (daily recommended)
- Archive completed review cycles older than 2 years
- Implement soft delete for user data (GDPR compliance)
- Monitor index usage and optimize as needed

## Analytics Queries

### Average completion time by role

```sql
SELECT
  sa.user_role,
  AVG(EXTRACT(EPOCH FROM (ua.completed_at - ua.started_at)) / 60) as avg_completion_minutes
FROM user_assessments ua
JOIN skills_assessments sa ON sa.assessment_id = ua.id
WHERE ua.is_completed = TRUE
GROUP BY sa.user_role;
```

### Cultural competency distribution by country

```sql
SELECT
  cb.country_of_origin,
  AVG(lp.cultural_competency_score) as avg_cultural_score,
  COUNT(*) as user_count
FROM cultural_backgrounds cb
JOIN learning_paths lp ON lp.user_id = cb.user_id
WHERE lp.is_active = TRUE
GROUP BY cb.country_of_origin
ORDER BY avg_cultural_score DESC;
```

### Most common skill gaps

```sql
SELECT
  skill_name,
  skill_category,
  AVG(gap_size) as avg_gap,
  COUNT(*) as occurrence_count
FROM skill_ratings
WHERE gap_size > 0
GROUP BY skill_name, skill_category
ORDER BY avg_gap DESC, occurrence_count DESC
LIMIT 20;
```

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for global compatibility
- UUID primary keys for scalability and security
- JSONB used for flexible response storage
- Comprehensive indexing for performance
- Support for soft delete and data archival
- Analytics-ready schema design
