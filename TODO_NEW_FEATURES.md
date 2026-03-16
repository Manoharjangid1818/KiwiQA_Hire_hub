# New Features Implementation Plan

## Task Overview
Add the following functionalities:
1. Admin can change their email and password
2. Candidate forgot password via OTP (or last password)
3. Admin can delete students from the list

---

## Implementation Plan

### Phase 1: Backend - Schema & Storage Updates

#### 1.1 Update Schema (shared/schema.ts)
- Add `passwordResetToken` field to users table (for reset token expiry)
- Add `lastPassword` field to store previous password for reference

#### 1.2 Update Storage (server/storage.ts)
- Add method: `updateUserEmail(id, newEmail)`
- Add method: `updateUserPassword(id, hashedPassword)`
- Add method: `createPasswordResetToken(userId, token, expiresAt)`
- Add method: `getPasswordResetToken(token)`
- Add method: `deletePasswordResetToken(token)`
- Add method: `deleteStudent(id)` - Admin can delete student

### Phase 2: Backend - API Routes

#### 2.1 Add routes in shared/routes.ts
- `admin.updateProfile` - PUT /api/admin/profile (change email/password)
- `auth.forgotPassword` - POST /api/auth/forgot-password
- `auth.resetPassword` - POST /api/auth/reset-password
- `users.deleteStudent` - DELETE /api/admin/students/:id

#### 2.2 Add routes in server/routes.ts
- PUT /api/admin/profile - Update admin email/password (with JWT auth)
- POST /api/auth/forgot-password - Request password reset OTP
- POST /api/auth/reset-password - Reset password with OTP
- DELETE /api/admin/students/:id - Delete a student (with admin auth)

### Phase 3: Frontend - New Pages

#### 3.1 Create new pages:
- `client/src/pages/auth/ForgotPassword.tsx` - Forgot password request
- `client/src/pages/auth/ResetPassword.tsx` - Reset with OTP
- `client/src/pages/admin/ProfileSettings.tsx` - Admin profile settings

#### 3.2 Update existing pages:
- `Login.tsx` - Add "Forgot Password?" link
- `AdminDashboard.tsx` - Add delete button to student list

### Phase 4: Frontend - Hooks Updates

#### 4.1 Update use-auth.ts
- Add `forgotPassword` mutation
- Add `resetPassword` mutation
- Add `updateProfile` mutation

#### 4.2 Update use-users.ts
- Add `deleteStudent` mutation
- Add refresh after delete

### Phase 5: Routing

#### 5.1 Update App.tsx
- Add routes for new pages

---

## Files to Modify:
1. `shared/schema.ts` - Add password reset fields
2. `shared/routes.ts` - Add new API route definitions
3. `server/storage.ts` - Add new storage methods
4. `server/routes.ts` - Add new API endpoints
5. `server/email.ts` - Add password reset email function (reuse OTP email)
6. `client/src/hooks/use-auth.ts` - Add new mutations
7. `client/src/hooks/use-users.ts` - Add delete mutation
8. `client/src/pages/auth/Login.tsx` - Add forgot password link
9. `client/src/pages/auth/ForgotPassword.tsx` - New file
10. `client/src/pages/auth/ResetPassword.tsx` - New file
11. `client/src/pages/admin/ProfileSettings.tsx` - New file
12. `client/src/pages/admin/Dashboard.tsx` - Add delete functionality
13. `client/src/App.tsx` - Add new routes

---

## Testing Steps:
1. Test admin change email functionality
2. Test admin change password functionality
3. Test student forgot password flow
4. Test admin delete student functionality
5. Verify all existing functionality still works

