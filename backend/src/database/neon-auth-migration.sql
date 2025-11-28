-- ===========================================
-- Neon Auth Migration Script
-- ===========================================
-- Run this after enabling Neon Auth in the console
-- This creates the user_profiles table for storing
-- roles and custom data linked to Neon Auth users
-- ===========================================

-- Create user_profiles table (linked to neon_auth.users_sync)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY,  -- Same ID as neon_auth.users_sync.id
  role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('employee', 'manager', 'admin')),
  department VARCHAR(100),
  location VARCHAR(100),
  profile_image TEXT,
  phone VARCHAR(50),
  job_title VARCHAR(100),
  hire_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- OPTIONAL: Migrate existing users to Neon Auth
-- ===========================================
-- If you have existing users in the old 'users' table,
-- you can create profiles for them after they re-register
-- via Neon Auth by matching on email:
--
-- INSERT INTO user_profiles (id, role, department, location, profile_image)
-- SELECT 
--   na.id,
--   COALESCE(u.role, 'employee'),
--   u.department,
--   u.location,
--   u.profile_image
-- FROM neon_auth.users_sync na
-- JOIN users u ON LOWER(na.email) = LOWER(u.email)
-- ON CONFLICT (id) DO UPDATE SET
--   role = EXCLUDED.role,
--   department = EXCLUDED.department,
--   location = EXCLUDED.location,
--   profile_image = EXCLUDED.profile_image;

-- ===========================================
-- VIEW: Combined user data
-- ===========================================
-- This view joins Neon Auth users with their profiles
-- for easy querying

CREATE OR REPLACE VIEW full_users AS
SELECT 
  na.id,
  na.email,
  na.name,
  COALESCE(up.role, 'employee') as role,
  up.department,
  up.location,
  up.profile_image,
  up.phone,
  up.job_title,
  up.hire_date,
  na.created_at,
  na.updated_at
FROM neon_auth.users_sync na
LEFT JOIN user_profiles up ON na.id = up.id
WHERE na.deleted_at IS NULL;

-- ===========================================
-- Row Level Security (RLS) Policies
-- ===========================================
-- Enable RLS for production security

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT
  USING (true);  -- For now, allow all reads. Tighten with auth.user_id() when RLS is configured

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (true);  -- For now, allow all updates. Tighten with auth.user_id() when RLS is configured

-- Policy: Allow inserts (for profile creation)
CREATE POLICY "Allow profile creation" ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- ===========================================
-- Sample Data (Optional)
-- ===========================================
-- Uncomment to add sample admin user profile after they register via Neon Auth
--
-- INSERT INTO user_profiles (id, role, department, location, job_title)
-- SELECT id, 'admin', 'Management', 'Belfast', 'System Administrator'
-- FROM neon_auth.users_sync
-- WHERE email = 'admin@culturalstaffing.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ===========================================
-- Verification Queries
-- ===========================================
-- Run these to verify the setup:

-- Check Neon Auth users
-- SELECT * FROM neon_auth.users_sync;

-- Check user profiles
-- SELECT * FROM user_profiles;

-- Check combined view
-- SELECT * FROM full_users;

-- Check users by role
-- SELECT * FROM full_users WHERE role = 'admin';

