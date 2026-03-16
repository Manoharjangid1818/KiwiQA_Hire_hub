# Fix: Result Download Button Not Activated

## Problem
The download button in the Admin Dashboard (Download Results tab) is disabled even when students have attempted the exam.

## Root Cause
1. The download button is disabled when `examAttemptsCount[exam.id] === 0`
2. There are duplicate route definitions for `/api/admin/exams-attempts-count` in server/routes.ts (the second one overrides the first)
3. The useEffect has `exams` in dependency array but may not fetch properly

## Solution Plan
1. Remove duplicate route definitions in server/routes.ts
2. Ensure the API endpoint returns correct attempt counts
3. Fix the useEffect dependency in Dashboard.tsx to properly fetch counts

## Files to Edit
1. server/routes.ts - Remove duplicate route definition
2. client/src/pages/admin/Dashboard.tsx - Fix useEffect dependency

## Implementation Steps
1. Fix server/routes.ts - Remove duplicate `/api/admin/exams-attempts-count` route (keep the better one that uses getExamAttemptsWithDetails)
2. Fix client/src/pages/admin/Dashboard.tsx - Remove `exams` from useEffect dependency array to prevent unnecessary re-fetches

