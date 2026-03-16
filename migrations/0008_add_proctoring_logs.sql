-- Add proctoring_logs table for gaze monitoring
CREATE TABLE IF NOT EXISTS proctoring_logs (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  warning_count INTEGER DEFAULT 0,
  details TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Add faceDetected column to exam_photos (if not exists)
ALTER TABLE exam_photos ADD COLUMN IF NOT EXISTS face_detected BOOLEAN DEFAULT true;
ALTER TABLE exam_photos ADD COLUMN IF NOT EXISTS multiple_faces BOOLEAN DEFAULT false;

