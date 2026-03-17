# GitHub Pages Deploy Fix - Dependency Install Failure (Exit Code 1)

## Status: In Progress
**Problem**: npm ci fails during \"Install dependencies\" (exit code 1) due to dep conflicts/lockfile.

**Plan Breakdown** (Approved):
- [x] Step 1: Create this TODO.md file  
- [x] Step 2: Edit .github/workflows/pages-deploy.yml 
  - Node 22 + cache-dependency-paths
  - Add corepack enable
  - npm install --frozen-lockfile
  - Build with working-directory: client
- [ ] Step 3: Local test: npm ci && npm run build:client (verify dist/)
- [ ] Step 4: git add . && git commit -m \"fix(gh-pages): resolve npm ci failure\" && git push
- [ ] Step 5: Monitor Actions: https://github.com/manoharjangid1818/KiwiQA_Hire_hub/actions
- [ ] Step 6: Verify deploy: https://manoharjangid1818.github.io/KiwiQA_Hire_hub/

## Expected Fixes:
- ✅ Node version: 20 → 22
- ✅ Install: npm ci → npm install --frozen-lockfile + corepack
- ✅ Build: Explicit client dir
- Artifact/deploy unchanged

**Updated**: $(date)
