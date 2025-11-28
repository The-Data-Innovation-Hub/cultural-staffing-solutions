-- Cultural Journey Map Database Schema
-- Implements GM-017 (Cloud sync) and GM-019 (Reflection storage)

-- =====================================================
-- TABLE: cultural_journey_progress
-- Tracks user progress through the Cultural Journey Map
-- =====================================================
CREATE TABLE IF NOT EXISTS cultural_journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  milestone_id VARCHAR(50) NOT NULL,
  module_id VARCHAR(50) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  stamp_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique progress per user/module combination
  UNIQUE(user_id, milestone_id, module_id)
);

-- Index for fast user progress lookups
CREATE INDEX IF NOT EXISTS idx_journey_progress_user ON cultural_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_journey_progress_milestone ON cultural_journey_progress(user_id, milestone_id);

-- =====================================================
-- TABLE: cultural_journey_milestones
-- Tracks milestone badge completion
-- =====================================================
CREATE TABLE IF NOT EXISTS cultural_journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  milestone_id VARCHAR(50) NOT NULL,
  badge_earned BOOLEAN DEFAULT FALSE,
  badge_earned_at TIMESTAMP,
  track_reflection TEXT, -- Reflection submitted when completing the track
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, milestone_id)
);

CREATE INDEX IF NOT EXISTS idx_journey_milestones_user ON cultural_journey_milestones(user_id);

-- =====================================================
-- TABLE: cultural_journey_reflections (GM-019)
-- Stores micro-journaling reflections for each module
-- =====================================================
CREATE TABLE IF NOT EXISTS cultural_journey_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  milestone_id VARCHAR(50) NOT NULL,
  module_id VARCHAR(50) NOT NULL,
  reflection_prompt TEXT NOT NULL,
  reflection_response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- One reflection per user/module
  UNIQUE(user_id, milestone_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_journey_reflections_user ON cultural_journey_reflections(user_id);

-- =====================================================
-- TABLE: cultural_journey_certificates (GM-018)
-- Stores generated certificates
-- =====================================================
CREATE TABLE IF NOT EXISTS cultural_journey_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  certificate_number VARCHAR(50) NOT NULL UNIQUE,
  total_stamps INTEGER NOT NULL,
  total_milestones INTEGER NOT NULL,
  total_reflections INTEGER DEFAULT 0,
  issued_at TIMESTAMP DEFAULT NOW(),
  cpd_points INTEGER DEFAULT 10,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- One certificate per user
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_journey_certificates_user ON cultural_journey_certificates(user_id);

-- =====================================================
-- VIEW: user_journey_summary
-- Aggregated view of user's Cultural Journey progress
-- =====================================================
CREATE OR REPLACE VIEW user_journey_summary AS
SELECT 
  u.id as user_id,
  u.email,
  COUNT(DISTINCT CASE WHEN p.completed THEN p.module_id END) as stamps_collected,
  COUNT(DISTINCT p.module_id) as total_modules_started,
  COUNT(DISTINCT CASE WHEN m.badge_earned THEN m.milestone_id END) as badges_earned,
  COUNT(DISTINCT r.id) as reflections_written,
  CASE WHEN c.id IS NOT NULL THEN TRUE ELSE FALSE END as certificate_earned,
  c.certificate_number,
  c.issued_at as certificate_issued_at
FROM user_profiles u
LEFT JOIN cultural_journey_progress p ON u.id = p.user_id
LEFT JOIN cultural_journey_milestones m ON u.id = m.user_id
LEFT JOIN cultural_journey_reflections r ON u.id = r.user_id AND r.reflection_response IS NOT NULL
LEFT JOIN cultural_journey_certificates c ON u.id = c.user_id
GROUP BY u.id, u.email, c.id, c.certificate_number, c.issued_at;

