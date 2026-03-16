# Fix AI Question Numbering Issue

## Issue
When AI generates questions, they come with numbers like "1. What is Python?" 
The frontend adds more numbering like `{idx + 1}.` causing "1.1" display.

## Solution
Strip leading numbers from question text in the server when processing AI-generated questions.

## Status: COMPLETED
- Added `cleanQuestionText()` function in `server/routes.ts`
- Applied the function when processing AI-generated questions
- The regex removes patterns like "1.", "2.", "1)", "2)", "[1]", etc.

