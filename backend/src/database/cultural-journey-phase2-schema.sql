-- Cultural Journey Map - Phase 2 Database Schema
-- For future implementation of Regional Tracks and Leaderboards
-- DO NOT RUN UNTIL PHASE 2 DEVELOPMENT BEGINS

-- =====================================================
-- PHASE 2.1: REGIONAL/COUNTRY-SPECIFIC TRACKS
-- Extends Cultural Journey Map with location-based cultural onboarding
-- =====================================================

-- Regional track definitions
CREATE TABLE IF NOT EXISTS cultural_journey_regions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  flag_emoji VARCHAR(10),
  description TEXT,
  healthcare_system VARCHAR(50), -- 'NHS England', 'NHS Scotland', 'HSC', 'HSE'
  module_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed regional data (for reference, adjust as needed)
-- INSERT INTO cultural_journey_regions (id, name, country, flag_emoji, description, healthcare_system, is_active) VALUES
-- ('england', 'England', 'United Kingdom', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'NHS England cultural onboarding', 'NHS England', false),
-- ('scotland', 'Scotland', 'United Kingdom', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'NHS Scotland cultural onboarding', 'NHS Scotland', false),
-- ('wales', 'Wales', 'United Kingdom', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'NHS Wales cultural onboarding', 'NHS Wales', false),
-- ('northern-ireland', 'Northern Ireland', 'United Kingdom', '🇬🇧', 'HSC Northern Ireland cultural onboarding', 'HSC', false),
-- ('ireland', 'Republic of Ireland', 'Ireland', '🇮🇪', 'HSE Ireland cultural onboarding', 'HSE', false);

-- User regional track assignments
CREATE TABLE IF NOT EXISTS cultural_journey_regional_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  region_id VARCHAR(50) NOT NULL REFERENCES cultural_journey_regions(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  assignment_reason VARCHAR(50), -- 'employment', 'user_choice', 'manager_assigned'
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  progress_percentage INTEGER DEFAULT 0,
  stamps_collected INTEGER DEFAULT 0,
  badge_earned BOOLEAN DEFAULT FALSE,
  
  UNIQUE(user_id, region_id)
);

CREATE INDEX IF NOT EXISTS idx_regional_progress_user ON cultural_journey_regional_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_regional_progress_region ON cultural_journey_regional_progress(region_id);

-- Regional module definitions
CREATE TABLE IF NOT EXISTS cultural_journey_regional_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id VARCHAR(50) NOT NULL REFERENCES cultural_journey_regions(id),
  module_id VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  stamp_emoji VARCHAR(10) DEFAULT '🏛️',
  order_index INTEGER DEFAULT 0,
  pro_tip TEXT,
  cultural_insight TEXT,
  reflection_prompt TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(region_id, module_id)
);

-- User regional module completion
CREATE TABLE IF NOT EXISTS cultural_journey_regional_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  region_id VARCHAR(50) NOT NULL,
  module_id VARCHAR(50) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  stamp_earned BOOLEAN DEFAULT FALSE,
  reflection_response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, region_id, module_id)
);


-- =====================================================
-- PHASE 2.2: PEER LEADERBOARD
-- Friendly competition with opt-in privacy
-- =====================================================

-- User leaderboard profile (opt-in)
CREATE TABLE IF NOT EXISTS cultural_journey_leaderboard_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Privacy settings
  opt_in BOOLEAN DEFAULT FALSE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  display_name VARCHAR(100),
  show_avatar BOOLEAN DEFAULT TRUE,
  show_badges BOOLEAN DEFAULT TRUE,
  show_reflections_count BOOLEAN DEFAULT TRUE,
  
  -- Gamification stats
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  -- Ranks (calculated)
  global_rank INTEGER,
  team_rank INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON cultural_journey_leaderboard_profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_streak ON cultural_journey_leaderboard_profiles(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_optin ON cultural_journey_leaderboard_profiles(opt_in);

-- XP transaction log
CREATE TABLE IF NOT EXISTS cultural_journey_xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  xp_type VARCHAR(50) NOT NULL,
  -- Types: 'module_complete', 'reflection', 'streak_bonus_7', 'streak_bonus_30', 
  --        'badge_earned', 'certificate_earned', 'peer_help', 'regional_module'
  description TEXT,
  related_module_id VARCHAR(100),
  related_milestone_id VARCHAR(100),
  earned_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_log_user ON cultural_journey_xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_type ON cultural_journey_xp_log(xp_type);
CREATE INDEX IF NOT EXISTS idx_xp_log_date ON cultural_journey_xp_log(earned_at DESC);

-- XP point values configuration
CREATE TABLE IF NOT EXISTS cultural_journey_xp_config (
  id VARCHAR(50) PRIMARY KEY,
  xp_amount INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed XP config
-- INSERT INTO cultural_journey_xp_config (id, xp_amount, description) VALUES
-- ('module_complete', 100, 'Complete a learning module'),
-- ('reflection_submit', 50, 'Submit a micro-reflection'),
-- ('milestone_badge', 500, 'Earn a milestone badge'),
-- ('streak_7_day', 200, '7-day learning streak bonus'),
-- ('streak_30_day', 1000, '30-day learning streak bonus'),
-- ('certificate_core', 2000, 'Earn Cultural Intelligence Certificate'),
-- ('certificate_regional', 1000, 'Complete a regional track'),
-- ('peer_help', 75, 'Help a peer (future feature)');

-- Team/group leaderboards
CREATE TABLE IF NOT EXISTS cultural_journey_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'team', 'department', 'ward', 'cohort', 'organisation'
  organisation_id UUID, -- Reference to organisation if applicable
  manager_user_id UUID REFERENCES user_profiles(id),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team membership
CREATE TABLE IF NOT EXISTS cultural_journey_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES cultural_journey_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'member', 'lead', 'manager'
  joined_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON cultural_journey_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON cultural_journey_team_members(user_id);

-- =====================================================
-- VIEWS FOR LEADERBOARDS
-- =====================================================

-- Global leaderboard view
CREATE OR REPLACE VIEW cultural_journey_global_leaderboard AS
SELECT 
  lp.user_id,
  COALESCE(lp.display_name, 'Anonymous User') as display_name,
  lp.is_anonymous,
  lp.total_xp,
  lp.current_streak,
  lp.longest_streak,
  up.profile_image,
  lp.show_avatar,
  lp.show_badges,
  (SELECT COUNT(*) FROM cultural_journey_milestones cm WHERE cm.user_id = lp.user_id AND cm.badge_earned = TRUE) as badges_earned,
  (SELECT COUNT(*) FROM cultural_journey_progress cp WHERE cp.user_id = lp.user_id AND cp.stamp_earned = TRUE) as stamps_collected,
  (SELECT id IS NOT NULL FROM cultural_journey_certificates cc WHERE cc.user_id = lp.user_id) as certificate_earned,
  RANK() OVER (ORDER BY lp.total_xp DESC) as global_rank
FROM cultural_journey_leaderboard_profiles lp
JOIN user_profiles up ON lp.user_id = up.id
WHERE lp.opt_in = TRUE
ORDER BY lp.total_xp DESC;

-- Team leaderboard view
CREATE OR REPLACE VIEW cultural_journey_team_leaderboard AS
SELECT 
  tm.team_id,
  t.name as team_name,
  lp.user_id,
  COALESCE(lp.display_name, 'Anonymous User') as display_name,
  lp.is_anonymous,
  lp.total_xp,
  lp.current_streak,
  RANK() OVER (PARTITION BY tm.team_id ORDER BY lp.total_xp DESC) as team_rank
FROM cultural_journey_team_members tm
JOIN cultural_journey_teams t ON tm.team_id = t.id
JOIN cultural_journey_leaderboard_profiles lp ON tm.user_id = lp.user_id
WHERE lp.opt_in = TRUE AND t.is_active = TRUE
ORDER BY tm.team_id, lp.total_xp DESC;


-- =====================================================
-- HELPER FUNCTION: Update user XP (Phase 2)
-- =====================================================

-- Function to add XP and update leaderboard profile
CREATE OR REPLACE FUNCTION add_journey_xp(
  p_user_id UUID,
  p_xp_type VARCHAR(50),
  p_description TEXT DEFAULT NULL,
  p_module_id VARCHAR(100) DEFAULT NULL,
  p_milestone_id VARCHAR(100) DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_xp_amount INTEGER;
  v_new_total INTEGER;
BEGIN
  -- Get XP amount from config
  SELECT xp_amount INTO v_xp_amount 
  FROM cultural_journey_xp_config 
  WHERE id = p_xp_type AND is_active = TRUE;
  
  IF v_xp_amount IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Log XP transaction
  INSERT INTO cultural_journey_xp_log (user_id, xp_amount, xp_type, description, related_module_id, related_milestone_id)
  VALUES (p_user_id, v_xp_amount, p_xp_type, p_description, p_module_id, p_milestone_id);
  
  -- Update leaderboard profile (if exists)
  UPDATE cultural_journey_leaderboard_profiles
  SET total_xp = total_xp + v_xp_amount,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING total_xp INTO v_new_total;
  
  RETURN COALESCE(v_new_total, v_xp_amount);
END;
$$ LANGUAGE plpgsql;

