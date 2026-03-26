# KiwiQA HireHub

A premium, production-ready online examination and hiring platform built for KiwiQA Services Pvt Ltd. Admins create and manage exams; candidates take them with real-time AI proctoring.

## Features

### For Admins
- **Exam Management** — Create, edit, delete, copy, and enable/disable exams
- **MCQ Question Bank** — Manual entry, bulk CSV upload (up to 200 questions), or AI-generated via Google Gemini
- **Coding Questions** — Monaco Editor-based coding assessments with multiple languages (JavaScript, Python, Java)
- **Live Monitoring** — Real-time candidate camera feeds and active session tracking
- **Analytics Dashboard** — Score distribution (bar chart), pass/fail breakdown (pie chart), average time per exam
- **Audit Logs** — Full action history: exam created/deleted, student started/submitted exams, coding submissions
- **Proctoring Logs** — Face detection, gaze tracking, tab-switch events per candidate
- **Re-exam Requests** — Approve or reject with admin notes
- **CSV Export** — Download results per exam with proctoring summary

### For Students / Candidates
- **MCQ Exams** — Randomised question & option order per candidate
- **Coding Tests** — Monaco Editor with Run/Submit, output panel, sample I/O display
- **AI Proctoring** — Face detection (TensorFlow.js / MediaPipe FaceMesh), gaze tracking, multiple-face detection
- **Anti-Cheat** — Tab switch detection, fullscreen enforcement, DevTools detection, screen resize detection
- **Auto-Submit** — Triggered after exceeding violation threshold
- **Results & Reports** — View scores, correct/incorrect answers, request re-exam

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui, Wouter |
| Charts | Recharts |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Backend | Express 5, TypeScript, Node.js |
| Database | PostgreSQL, Drizzle ORM |
| Auth | JWT (stored in `localStorage`) |
| Email | Nodemailer (Gmail SMTP) |
| AI Questions | Google Gemini API |
| Proctoring | TensorFlow.js, MediaPipe FaceMesh |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/Manoharjangid1818/KiwiQA_Hire_hub.git
cd KiwiQA_Hire_hub

# Install dependencies
npm install

# Copy example env file and fill in your values
cp .env.example .env
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kiwiqa

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_strong_jwt_secret_here

# SMTP for emails (OTP, password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Google Gemini (AI question generation)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Database Setup

```bash
# Push schema to your database
npm run db:push
```

### Running the App

```bash
# Development (starts on port 5000)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Default Admin Account

On first run, a default admin is seeded:
- **Email:** `admin@kiwiqa.com`
- **Password:** `admin123`

> Change this password immediately after first login in a production environment.

## Project Structure

```
├── client/                # React frontend (Vite)
│   └── src/
│       ├── pages/
│       │   ├── admin/     # Dashboard, ManageExam, Analytics, AuditLogs
│       │   └── student/   # Dashboard, TakeExam, CodingExam, ExamResult
│       ├── hooks/         # React Query hooks
│       └── components/    # Shared UI components
├── server/                # Express backend
│   ├── routes.ts          # All API endpoints
│   ├── storage.ts         # Database access layer (Drizzle)
│   └── index.ts           # Server entrypoint
├── shared/                # Shared between client and server
│   ├── schema.ts          # Drizzle schema + TypeScript types
│   └── routes.ts          # API route constants + Zod schemas
└── script/
    └── build.ts           # Custom build script
```

## Deployment

### Replit (Recommended)
This project is configured to run on Replit. Click the **Deploy** button in the Replit interface to publish.

### Manual / VPS
```bash
npm run build
NODE_ENV=production npm start
```

### GitHub Pages (Frontend only)
> Note: GitHub Pages only hosts static files. The backend must be hosted separately.
```bash
npm run build:client
npm run deploy
```

## Security Notes

- Never commit `.env` to version control — it is listed in `.gitignore`
- Rotate your `JWT_SECRET`, SMTP credentials, and API keys in production
- The default admin password **must** be changed before going live

## License

MIT — KiwiQA Services Pvt Ltd
