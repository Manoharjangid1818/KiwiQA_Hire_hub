-- Add verification_expiry column to users table
ALTER TABLE "users" ADD COLUMN "verification_expiry" timestamp;

