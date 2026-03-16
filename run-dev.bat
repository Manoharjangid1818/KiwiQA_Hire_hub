@echo off
cd /d "%~dp0"
set SMTP_USER=manoharrajotiya21@gmail.com
set SMTP_PASS=hflb zbdi dytc hjdn
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set DATABASE_URL=postgresql://postgres:6353843900@localhost:5432/kiwiqa
set NODE_ENV=development
set GEMINI_API_KEY=AIzaSyD0K0yeZSmHNgeaUftBHEdU7pPKI9dRY2I
npx tsx server/index.ts

