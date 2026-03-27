# KiwiQA HireHub

An online exam portal built for KiwiQA Services. Admins create and manage exams; candidates take them with live proctoring.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui + Wouter (hash routing)
- **Backend**: Express 5 + TypeScript (tsx)
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: JWT (stored in localStorage as `kiwiqa_token`)
- **AI**: Google Gemini API for question generation

## Architecture

- `client/` — React SPA (Vite root)
- `server/` — Express API + Vite dev middleware
- `shared/` — Drizzle schema + route constants shared between client and server
- `migrations/` — Drizzle migration output

## Running the App

```bash
npm run dev       # Start dev server on port 5000
npm run build     # Build client + bundle server to dist/
npm start         # Run production build
npm run db:push   # Sync Drizzle schema to database
```

## Environment Variables (set via Replit Secrets)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-provided by Replit) |
| `GEMINI_API_KEY` | Google Gemini API key for AI question generation |
| `SMTP_USER` | Gmail address for sending OTP/reset emails |
| `SMTP_PASS` | Gmail app password |
| `SMTP_HOST` | SMTP host (e.g. smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (e.g. 587) |
| `SESSION_SECRET` | Secret for session signing |

## Default Admin

Email: `admin@kiwiqa.com` / Password: `admin123` (seeded on first run)

## Key Features

### Admin
- Dashboard with stats: Total Exams, Active Exams, Total Candidates, Pending Re-exam Requests
- Tabs: Manage Exams | Candidates | Re-exam Requests | Download Results | Proctoring Logs
- Create/edit/delete/copy/enable-disable exams
- **CSV Validation**: Exam cannot be created unless a valid CSV with at least 1 question is uploaded
- **Edit Exam CSV Upload**: In ManageExam page, "Upload Questions via CSV" merges new questions into existing ones
- Manual MCQ creation + CSV upload (up to 200 questions)
- AI question generation via Gemini
- Token-based exam links with open/start/complete tracking
- Live monitoring per exam (active sessions, camera feeds)
- Export results as CSV per exam
- **Analytics Dashboard** (`/admin/analytics`): Score Distribution (bar), Pass/Fail Breakdown (pie), Avg Time per Exam (bar) — using Recharts
- **Audit Log System** (`/admin/audit-logs`): Tracks exam created/deleted, exam started/submitted, coding solutions submitted — filterable by role/action/search
- **Coding Question Management**: Per-exam coding questions with Monaco Editor, sample I/O, starter code, multi-language (JS/Python/Java)

### Student
- Exam list (only enabled exams shown)
- Full proctoring during exam: webcam, microphone, face detection, tab-switch detection, devtools detection, screen resize detection
- **Enhanced Audio VAD**: Multi-band voice detection (F0 85–255Hz + formant 300–3400Hz) ignores fan/AC/music, triggers only on continuous human speech (2.5s)
- Warning system (up to MAX_WARNINGS, then auto-submit)
- View results, pass/fail status
- Request re-exam after completion
- **Coding Test** (`/student/coding/:examId`): Monaco Editor environment with Run/Submit per question, multi-language support, anti-cheat (tab switch, resize, devtools warnings), output panel

### UI / Theme
- **Dark/Light Mode toggle** in Navbar (all protected pages) — persisted to localStorage
- `ThemeProvider` in `client/src/hooks/use-theme.tsx` wraps entire app via App.tsx
- CSS variables defined in `index.css` for both `:root` (light) and `.dark` class scopes

## Database Tables

| Table | Purpose |
|---|---|
| `users` | Auth + roles |
| `exams` | Exam metadata |
| `questions` | MCQ questions |
| `exam_attempts` | Student attempt tracking |
| `student_answers` | Individual answers |
| `exam_photos` | Periodic snapshots |
| `reexam_requests` | Re-exam workflow |
| `exam_links` | Shareable links |
| `exam_sessions` | Link-based sessions |
| `camera_frames` | Live monitoring frames |
| `proctoring_logs` | Gaze/face event logs |
| `audit_logs` | Admin/student action log |
| `coding_questions` | Monaco editor questions |
| `coding_submissions` | Student code submissions |

## Notable Implementation Details

- Vite runs in middleware mode inside Express (not standalone)
- `server/vite.ts` custom logger skips `process.exit(1)` on non-fatal pre-transform errors
- `vite.transformIndexHtml` always receives `"/"` as base URL to avoid relative path resolution issues
- Static build served from `dist/` directory in production
- Hash-based routing (`useHashLocation` from wouter) so all routes are served from `/`
