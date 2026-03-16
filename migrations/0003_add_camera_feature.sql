-- Migration: Add camera feature tables and fields
-- Created for: Camera access during exam time feature

-- Add requireCamera field to exams table
ALTER TABLE exams ADD COLUMN require_camera boolean DEFAULT false;

-- Create exam_photos table
CREATE TABLE exam_photos (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  photo_data TEXT NOT NULL,
  captured_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster photo retrieval
CREATE INDEX idx_exam_photos_attempt_id ON exam_photos(attempt_id);

