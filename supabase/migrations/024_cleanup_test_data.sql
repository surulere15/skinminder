-- Safe test data cleanup script
-- Run this to remove all test/dev data while preserving schema and structure
-- Does NOT drop any tables or columns

BEGIN;

-- Delete test scan data (cascades to skin_regions via FK)
DELETE FROM skin_regions
WHERE scan_id IN (SELECT id FROM skin_scans WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
));

DELETE FROM skin_scans
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
);

-- Delete test routine data
DELETE FROM routine_versions
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
);

DELETE FROM routine_history
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
);

-- Delete test chat messages
DELETE FROM chat_messages
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
);

-- Delete test recommendations
DELETE FROM recommendations
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
);

-- Delete test profiles (cascades to all user-owned tables)
DELETE FROM profiles
WHERE id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
);

-- Delete test auth users
DELETE FROM auth.users
WHERE email LIKE '%@test.com' OR email LIKE '%@example.com';

-- Reset sequences
ALTER SEQUENCE IF EXISTS background_jobs_id_seq RESTART WITH 1;

COMMIT;
