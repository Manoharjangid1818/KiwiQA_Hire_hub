# Clean and reinstall node_modules
$ErrorActionPreference = "SilentlyContinue"
$projectPath = "c:\Users\manoh\OneDrive\Desktop\KiwiQA-Online\KiwiQA-Online"

# Force remove node_modules
Write-Host "Removing node_modules..."
Get-ChildItem -Path "$projectPath\node_modules" -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
Remove-Item -Path "$projectPath\node_modules" -Force -Recurse -ErrorAction SilentlyContinue

# Install fresh
Write-Host "Installing dependencies..."
Set-Location $projectPath
npm install

# Run dev
Write-Host "Starting dev server..."
npm run dev

