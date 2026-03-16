-- Add isEnabled field to exams table
ALTER TABLE exams ADD COLUMN is_enabled BOOLEAN DEFAULT true;

-- Set existing exams to enabled (true) by default
UPDATE exams SET is_enabled = true WHERE is_enabled IS NULL;

-- Make sure the column is NOT NULL after update
ALTER TABLE exams ALTER COLUMN is_enabled SET NOT NULL;

