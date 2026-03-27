import { readFileSync } from 'fs';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const BASE = 'http://localhost:5000';

async function api(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// 1. Login
const loginRes = await api('POST', '/api/auth/login', {
  email: 'admin@kiwiqa.com',
  password: 'admin123',
});
const token = loginRes.token;
if (!token) { console.error('Login failed:', loginRes); process.exit(1); }
console.log('Logged in OK');

// 2. Create exam
const exam = await api('POST', '/api/admin/exams', {
  title: 'General Programming Knowledge - Demo Exam',
  description: 'A 50-question demo exam covering HTML, CSS, JavaScript, Python, SQL, data structures, algorithms and core software engineering fundamentals.',
  durationMinutes: 60,
  totalMarks: 50,
  passingMarks: 25,
  requireCamera: false,
}, token);

if (!exam?.id) { console.error('Create exam failed:', exam); process.exit(1); }
console.log(`Exam created: ID=${exam.id} — "${exam.title}"`);

// 3. Upload CSV using multipart form
const __dir = dirname(fileURLToPath(import.meta.url));
const csvPath = join(__dir, 'demo_questions.csv');
const csvContent = readFileSync(csvPath);

const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
const CRLF = '\r\n';

const bodyParts = [
  `--${boundary}${CRLF}Content-Disposition: form-data; name="examId"${CRLF}${CRLF}${exam.id}`,
  `--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="demo_questions.csv"${CRLF}Content-Type: text/csv${CRLF}${CRLF}`,
];

const bodyBuffer = Buffer.concat([
  Buffer.from(bodyParts[0] + CRLF + bodyParts[1]),
  csvContent,
  Buffer.from(`${CRLF}--${boundary}--${CRLF}`),
]);

const uploadRes = await fetch(`${BASE}/api/admin/upload-questions`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': bodyBuffer.byteLength,
  },
  body: bodyBuffer,
});

const uploadJson = await uploadRes.json();
console.log('Upload result:', uploadJson);
if (uploadRes.ok) {
  const count = uploadJson.totalInserted ?? uploadJson.inserted ?? 0;
  console.log(`\nDone! ${count} questions uploaded to exam ID ${exam.id}`);
  console.log(`Visit: /#/admin/exams/${exam.id} to manage the exam`);
} else {
  console.error('Upload failed:', uploadJson);
}
