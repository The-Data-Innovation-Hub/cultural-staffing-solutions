-- Migration script to update existing schema
-- This adds missing columns to existing tables

-- Update users table: add name column (computed from first_name and last_name)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
UPDATE users SET name = CONCAT(first_name, ' ', last_name) WHERE name IS NULL;

-- Update learning_paths table: add all missing columns
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS assessment_id UUID REFERENCES user_assessments(id) ON DELETE SET NULL;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS path_name VARCHAR(255);
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS path_description TEXT;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS overall_score INTEGER;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS cultural_competency_score INTEGER;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS skills_score INTEGER;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS estimated_completion_weeks INTEGER;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(50);
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'in_progress';
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Copy data from old columns to new columns where applicable
UPDATE learning_paths SET path_name = title WHERE path_name IS NULL;
UPDATE learning_paths SET path_description = description WHERE path_description IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_is_active ON learning_paths(is_active);

-- Success message
SELECT 'Migration completed successfully!' as status;
