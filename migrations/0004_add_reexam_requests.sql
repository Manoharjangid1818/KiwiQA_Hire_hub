-- Re-Exam Request Feature Migration
-- Run this SQL in your PostgreSQL database

-- Create reexam_requests table
CREATE TABLE IF NOT EXISTS reexam_requests (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  admin_note TEXT
);

-- Create indexes
CREATE INDEX idx_reexam_requests_student ON reexam_requests(student_id);
CREATE INDEX idx_reexam_requests_status ON reexam_requests(status);
CREATE INDEX idx_reexam_requests_exam ON reexam_requests(exam_id);
