-- Exam Links and Sessions Migration
-- Run this SQL in your PostgreSQL database

-- Create exam_links table
CREATE TABLE IF NOT EXISTS exam_links (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  unique_code VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create exam_sessions table
CREATE TABLE IF NOT EXISTS exam_sessions (
  id SERIAL PRIMARY KEY,
  exam_link_id INTEGER NOT NULL REFERENCES exam_links(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started',
  attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE SET NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(50)
);

-- Create camera_frames table
CREATE TABLE IF NOT EXISTS camera_frames (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE SET NULL,
  frame_data TEXT NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_exam_links_exam ON exam_links(exam_id);
CREATE INDEX idx_exam_links_code ON exam_links(unique_code);
CREATE INDEX idx_exam_sessions_exam ON exam_sessions(exam_id);
CREATE INDEX idx_exam_sessions_email ON exam_sessions(student_email);
CREATE INDEX idx_exam_sessions_status ON exam_sessions(status);
CREATE INDEX idx_exam_sessions_link ON exam_sessions(exam_link_id);
CREATE INDEX idx_camera_frames_session ON camera_frames(session_id);
CREATE INDEX idx_camera_frames_attempt ON camera_frames(attempt_id);

