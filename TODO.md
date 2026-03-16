# GitHub Pages 404 Fix - Deploy Plan

## Completed
- [x] Created deployment plan
- [x] Analyzed project structure and configs
- [x] Created package-new.json with scripts/deps (rename to package.json)
- [x] Created .github/workflows/pages-deploy.yml

## Steps to Complete
1. Rename package-new.json to package.json
2. Update vite.config.ts base: '/repo-name/'
3. `npm install`
4. Commit all changes (git add . ; git commit -m "Add GitHub Pages deploy")
5. Push (git push)
6. Wait for Actions, test https://<username>.github.io/<repo>
Local test: `npm run build:client && npx vite preview`

**Note:** Repo name/username for base and URL? Adjust vite base to '/repo/' if not root Pages.


