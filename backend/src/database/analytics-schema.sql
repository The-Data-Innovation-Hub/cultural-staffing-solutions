-- ============================================================================
-- Healthcare Workforce Analytics Database Schema
-- ============================================================================
-- This schema supports:
-- 1. Performance monitoring & analytics
-- 2. Skill gap analysis
-- 3. Training effectiveness metrics
-- 4. Sentiment analysis & retention prediction
-- 5. AI/ML data collection
-- ============================================================================

-- Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL, -- e.g., "2025-01", "Q1-2025"

  -- Core KPIs
  goal_achievement_rate INTEGER CHECK (goal_achievement_rate >= 0 AND goal_achievement_rate <= 100),
  work_quality_score INTEGER CHECK (work_quality_score >= 0 AND work_quality_score <= 100),
  productivity_efficiency INTEGER CHECK (productivity_efficiency >= 0 AND productivity_efficiency <= 100),
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  overall_performance INTEGER CHECK (overall_performance >= 0 AND overall_performance <= 100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, period)
);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_period ON performance_metrics(period);

-- Performance Goals
CREATE TABLE IF NOT EXISTS performance_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(50) NOT NULL, -- clinical, cultural, technical, compliance
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'on_track', -- on_track, at_risk, behind, completed
  completion_rate INTEGER DEFAULT 0 CHECK (completion_rate >= 0 AND completion_rate <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_performance_goals_user_id ON performance_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_goals_status ON performance_goals(status);

-- Skill Gap Analysis
CREATE TABLE IF NOT EXISTS skill_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  overall_gap_score INTEGER CHECK (overall_gap_score >= 0 AND overall_gap_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON skill_assessments(user_id);

CREATE TABLE IF NOT EXISTS skill_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES skill_assessments(id) ON DELETE CASCADE,
  category VARCHAR(100),
  skill_name VARCHAR(255) NOT NULL,
  current_level INTEGER CHECK (current_level >= 0 AND current_level <= 100),
  required_level INTEGER CHECK (required_level >= 0 AND required_level <= 100),
  gap INTEGER, -- computed: required_level - current_level
  priority VARCHAR(50), -- critical, high, medium, low
  training_recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skill_areas_assessment_id ON skill_areas(assessment_id);

-- Training Effectiveness
CREATE TABLE IF NOT EXISTS training_effectiveness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR(100) NOT NULL,
  period VARCHAR(20) NOT NULL,

  -- Engagement Metrics
  completion_rate DECIMAL(5,2),
  average_time_to_complete DECIMAL(10,2), -- hours
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),

  -- Knowledge Metrics
  pre_assessment_average DECIMAL(5,2),
  post_assessment_average DECIMAL(5,2),
  knowledge_improvement DECIMAL(5,2),
  pass_rate DECIMAL(5,2),

  -- Application Metrics
  time_to_competency DECIMAL(10,2), -- days
  transfer_of_training INTEGER CHECK (transfer_of_training >= 0 AND transfer_of_training <= 100),
  manager_satisfaction_score INTEGER CHECK (manager_satisfaction_score >= 0 AND manager_satisfaction_score <= 100),

  -- Impact Metrics
  productivity_increase DECIMAL(5,2),
  error_reduction DECIMAL(5,2),
  patient_satisfaction_impact DECIMAL(5,2),

  -- Meta
  total_enrollments INTEGER DEFAULT 0,
  sample_size INTEGER DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(course_id, period)
);

CREATE INDEX IF NOT EXISTS idx_training_effectiveness_course_id ON training_effectiveness(course_id);

-- Learner Engagement Tracking
CREATE TABLE IF NOT EXISTS learner_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  time_spent INTEGER DEFAULT 0, -- minutes
  videos_watched INTEGER DEFAULT 0,
  interactions_completed INTEGER DEFAULT 0,
  quizzes_attempted INTEGER DEFAULT 0,
  resources_downloaded INTEGER DEFAULT 0,
  forum_participation INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE,
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_learner_engagement_user_id ON learner_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_engagement_course_id ON learner_engagement(course_id);

-- Employee Feedback & Sentiment
CREATE TABLE IF NOT EXISTS employee_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL, -- survey, check_in, open_ended, pulse
  responses JSONB,
  raw_text TEXT,
  sentiment_score DECIMAL(5,2), -- -100 to +100
  analyzed_themes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employee_feedback_user_id ON employee_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_employee_feedback_type ON employee_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_employee_feedback_created_at ON employee_feedback(created_at);

-- Sentiment Analysis Results
CREATE TABLE IF NOT EXISTS sentiment_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  overall_sentiment VARCHAR(50), -- very_positive, positive, neutral, negative, very_negative
  sentiment_score DECIMAL(5,2), -- -100 to +100

  -- Dimension Scores
  job_satisfaction INTEGER CHECK (job_satisfaction >= 0 AND job_satisfaction <= 100),
  work_life_balance INTEGER CHECK (work_life_balance >= 0 AND work_life_balance <= 100),
  team_dynamics INTEGER CHECK (team_dynamics >= 0 AND team_dynamics <= 100),
  management_support INTEGER CHECK (management_support >= 0 AND management_support <= 100),
  career_growth INTEGER CHECK (career_growth >= 0 AND career_growth <= 100),
  workload INTEGER CHECK (workload >= 0 AND workload <= 100),

  -- Warning Signs
  burnout_risk VARCHAR(50), -- low, moderate, high, critical
  attrition_risk VARCHAR(50), -- low, moderate, high, critical

  -- Analysis Meta
  feedback_analyzed INTEGER DEFAULT 0,
  key_themes TEXT[],
  positive_indicators TEXT[],
  concern_indicators TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_user_id ON sentiment_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_date ON sentiment_analysis(analysis_date);

-- Retention Prediction
CREATE TABLE IF NOT EXISTS retention_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attrition_risk DECIMAL(5,2), -- 0-100, probability of leaving
  risk_level VARCHAR(50), -- low, moderate, high, critical
  confidence DECIMAL(5,2), -- 0-100, model confidence
  trend_direction VARCHAR(50), -- improving, stable, declining

  -- Model Info
  model_version VARCHAR(50),
  feature_importance JSONB, -- JSON object with factor names and importance scores

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_retention_predictions_user_id ON retention_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_retention_predictions_risk ON retention_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_retention_predictions_date ON retention_predictions(prediction_date);

-- Retention Data Points (for ML training)
CREATE TABLE IF NOT EXISTS retention_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,

  -- Work Pattern Data
  weekly_hours DECIMAL(5,2),
  overtime_hours DECIMAL(5,2),
  shift_variability DECIMAL(5,2),
  consecutive_days INTEGER,

  -- Patient Load
  patients_per_shift DECIMAL(5,2),
  acuity_score DECIMAL(5,2),

  -- Engagement
  training_completion DECIMAL(5,2),
  meeting_attendance DECIMAL(5,2),
  voluntary_activities INTEGER,

  -- Performance
  performance_score DECIMAL(5,2),
  error_rate DECIMAL(5,2),
  compliance_score DECIMAL(5,2),

  -- Social
  team_collaboration_score DECIMAL(5,2),
  manager_interactions INTEGER,
  peer_support_score DECIMAL(5,2),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, record_date)
);

CREATE INDEX IF NOT EXISTS idx_retention_data_points_user_id ON retention_data_points(user_id);
CREATE INDEX IF NOT EXISTS idx_retention_data_points_date ON retention_data_points(record_date);

-- Analytics Alerts
CREATE TABLE IF NOT EXISTS analytics_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity VARCHAR(50) NOT NULL, -- info, warning, critical
  category VARCHAR(50) NOT NULL, -- performance, training, sentiment, retention
  title VARCHAR(255) NOT NULL,
  description TEXT,
  affected_users UUID[],
  action_required BOOLEAN DEFAULT false,
  recommendations TEXT[],
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_alerts_severity ON analytics_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_analytics_alerts_category ON analytics_alerts(category);
CREATE INDEX IF NOT EXISTS idx_analytics_alerts_resolved ON analytics_alerts(resolved_at);

-- AI Insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type VARCHAR(50) NOT NULL, -- pattern, anomaly, prediction, recommendation
  category VARCHAR(50) NOT NULL, -- performance, training, skills, sentiment, retention
  title VARCHAR(255) NOT NULL,
  description TEXT,
  confidence DECIMAL(5,2), -- 0-100
  impact VARCHAR(50), -- low, medium, high
  suggested_actions TEXT[],
  data_points JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_category ON ai_insights(category);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at);

-- Interaction Tracking (for ML)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- click, view, complete, submit, etc.
  entity_type VARCHAR(100), -- course, assessment, feedback, etc.
  entity_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_event_type ON user_interactions(event_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at);

-- Success message
SELECT 'Analytics schema created successfully!' as status;
