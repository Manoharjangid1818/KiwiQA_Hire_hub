# KiwiQA Online - Development Runner
# This script starts both the Express server and Vite dev server

$ErrorActionPreference = "Continue"

Write-Host "Starting KiwiQA Online Development Server..." -ForegroundColor Cyan

# Start the Express API server in background
Write-Host "Starting Express API server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'a:\Projects\KiwiQA-Online'; npx tsx server/index.ts" -WindowStyle Normal

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start Vite dev server in background
Write-Host "Starting Vite dev server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'a:\Projects\KiwiQA-Online'; npx vite" -WindowStyle Normal

Write-Host ""
Write-Host "Development servers should be running!" -ForegroundColor Green
Write-Host "- API Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor Cyan
