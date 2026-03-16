# TODO: Add Minimum Passing Marks Feature

## Progress Tracking

- [x] 1. Analyze codebase and create plan
- [x] 2. Create migration file for passingMarks column
- [x] 3. Update schema.ts - add passingMarks to exams table
- [x] 4. Update routes.ts - add passingMarks to examInputSchema
- [x] 5. Update Admin Dashboard - add passingMarks input field
- [x] 6. Update Exam Result - display pass/fail status
- [ ] 7. Run the migration to add column to database

## Implementation Details

### 1. Migration
- Added `migrations/0006_add_passing_marks.sql` - adds `passing_marks` column to `exams` table (integer, nullable)

### 2. Schema (shared/schema.ts)
- Added `passingMarks: integer("passing_marks")` to exams table

### 3. API Schema (shared/routes.ts)
- Added `passingMarks: z.number().int().min(0).optional()` to examInputSchema

### 4. Admin Dashboard (client/src/pages/admin/Dashboard.tsx)
- Added input field for "Minimum Passing Marks" in:
  - Create exam form
  - CSV upload form
  - Edit exam form

### 5. Exam Result (client/src/pages/student/ExamResult.tsx)
- Shows pass/fail status based on score >= passingMarks
- Displays: Your Score, Passing Marks, Total Marks
- Shows "You passed!" or "You need X more marks to pass"
- Visual indicators: Green for pass, Red for fail

