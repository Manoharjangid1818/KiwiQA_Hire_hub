# Exam Enable/Disable Feature Implementation

## Status: COMPLETED

### Steps Completed:
- [x] 1. Create database migration to add `isEnabled` field to exams table (migrations/0007_add_exam_enabled.sql)
- [x] 2. Update shared/schema.ts to add `isEnabled` field
- [x] 3. Update server/storage.ts to handle `isEnabled` in create/update operations
- [x] 4. Update server/routes.ts - add toggle endpoint and check in public exam
- [x] 5. Add useToggleExam hook in client/src/hooks/use-exams.ts
- [x] 6. Update Admin Dashboard to show enable/disable toggle
- [x] 7. Update PublicExam.tsx to check if exam is enabled

### Summary of Changes:
1. **Database**: Added `is_enabled` boolean column (default: true) to exams table
2. **Schema**: Added `isEnabled` field to exams table definition
3. **Storage**: Updated createExam to handle isEnabled field
4. **Routes**: 
   - Updated PUT /api/exams/:id to handle isEnabled
   - Added PATCH /api/admin/exams/:id/toggle endpoint
   - Added check in GET /api/public/exam/:code to return 403 if exam is disabled
5. **Hooks**: Added useToggleExam mutation hook
6. **Admin Dashboard**: 
   - Added enable/disable status indicator (green "Enabled" / red "Disabled")
   - Added toggle option in dropdown menu (Enable Exam / Disable Exam)
7. **PublicExam**: Added handling for 403 status to show "Exam Disabled" message

### How to use:
1. Run the migration: `psql -d kiwiqa -f migrations/0007_add_exam_enabled.sql`
2. Restart the server
3. In Admin Dashboard, each exam card now shows:
   - Green "Enabled" or red "Disabled" status
   - In the "Edit Exam" dropdown menu, there's an option to Enable/Disable the exam
4. When an exam is disabled, students trying to access it via public link will see: "This exam is currently disabled. Please contact your instructor."

