# Fix Vercel Deployment - Embla Carousel Version Error

## Steps:

### 1. [x] Edit package.json
- Change \`\"embla-carousel-react\":\"^8.6.6\"\` → \`\"embla-carousel-react\":\"^8.6.0\"\`

### 2. [x] Delete duplicate package files
- rm package-fixed.json package-new.json

### 3. [x] Regenerate package-lock.json
- Delete package-lock.json
- `npm install`

### 4. [x] Test local build
- `npm run build:client`

### 5. [ ] Commit and push changes
- git add .
- git commit -m \"fix: embla-carousel-react version for Vercel\"
- git push

## Status: Starting Step 1
