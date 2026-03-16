# TODO: Remove Attempts Option from Dashboard

## Plan - COMPLETED

### Step 1: Edit App.tsx ✅
- [x] Remove `/student/attempts` route (duplicate of `/student`)

### Step 2: Edit Admin Dashboard.tsx ✅
- [x] Remove "Total Attempts" stat card
- [x] Remove "Completed" stat card
- [x] Remove "All Attempts" tab from TabsList
- [x] Remove "All Attempts" tab content
- [x] Remove attempt-related imports (useAllAttempts, useAttemptDetails, useUpdateAttemptStatus)
- [x] Remove attempt-related state variables (selectedAttemptId, attemptDetails)
- [x] Remove attempt-related functions (handleViewAttempt, handleUpdateStatus, getAttemptStats)
- [x] Remove attempt details modal

### Step 3: Edit Student Dashboard.tsx ✅
- [x] Remove "Exam History" tab
- [x] Remove import of useStudentAttempts
- [x] Remove tabs, keep only "Available Exams" section

