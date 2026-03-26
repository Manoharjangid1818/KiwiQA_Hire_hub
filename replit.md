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
- Manual MCQ creation + CSV upload (up to 200 questions)
- AI question generation via Gemini
- Token-based exam links with open/start/complete tracking
- Live monitoring per exam (active sessions, camera feeds)
- Export results as CSV per exam

### Student
- Exam list (only enabled exams shown)
- Full proctoring during exam: webcam, microphone, face detection, tab-switch detection
- Warning system (up to MAX_WARNINGS, then auto-submit)
- View results, pass/fail status
- Request re-exam after completion

## Notable Implementation Details

- Vite runs in middleware mode inside Express (not standalone)
- `server/vite.ts` custom logger skips `process.exit(1)` on non-fatal pre-transform errors
- `vite.transformIndexHtml` always receives `"/"` as base URL to avoid relative path resolution issues
- Static build served from `dist/` directory in production
- Hash-based routing (`useHashLocation` from wouter) so all routes are served from `/`
