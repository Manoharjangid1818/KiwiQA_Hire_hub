# CSV Upload Questions - Implementation Plan

## Task Summary
Update the online exam web application to support uploading questions via CSV file with support for 100+ questions.

## Current Status ✅ COMPLETED
- Frontend upload UI exists at `/admin/upload-questions`
- Backend endpoint exists at `/api/admin/upload-questions`
- CSV parsing now case-insensitive
- Navigation button added to admin dashboard

## Implementation Completed

### 1. Backend CSV Parser (server/routes.ts) ✅
- Make CSV field parsing case-insensitive
- Handle both "Question" and "question" headers
- Handle both "OptionA" and "optionA" headers
- Improve validation and error messages
- Ensure large file handling (100+ questions)
- Add row number in error messages for easier debugging
- Add progress logging for large files

### 2. Frontend Upload Page (client/src/pages/admin/UploadQuestions.tsx) ✅
- UI already exists with proper format
- Add better validation feedback
- Ensure sample CSV matches expected format
- Add format instructions and header examples
- Show feature highlights (100+ questions, case-insensitive)

### 3. Admin Dashboard Navigation (client/src/pages/admin/Dashboard.tsx) ✅
- Add "Upload CSV" button in admin dashboard
- Button navigates to /admin/upload-questions

## Files Modified
- `KiwiQA-Online/server/routes.ts` - CSV parser fix with case-insensitive headers
- `KiwiQA-Online/client/src/pages/admin/Dashboard.tsx` - Add navigation button
- `KiwiQA-Online/client/src/pages/admin/UploadQuestions.tsx` - Improved UI and sample CSV

## CSV Format Supported
```
Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Marks
What is the capital of France?,Berlin,Madrid,Paris,Rome,C,1
2 + 2 = ?,3,4,5,6,B,1
```

Supported headers (case-insensitive):
- Question, QuestionText, Questions
- OptionA, Option_A
- OptionB, Option_B
- OptionC, Option_C
- OptionD, Option_D
- CorrectAnswer, Correct_Answer, Answer
- Marks, Mark, Points

