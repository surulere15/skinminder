# SkinMinder Mobile — Test Account Setup

## Quick Test Account Creation

Run this in your Supabase SQL editor to create a test user:

```sql
-- Create test user (password: TestPass123!)
-- Note: You'll need to set the password hash via Supabase Auth UI or API
-- The easiest way is to create the user via the Supabase Dashboard → Auth → Users
```

### Steps:
1. Go to Supabase Dashboard → Auth → Users → Add User
2. Email: `test@skinminder.ai`
3. Password: `TestPass123!`
4. Confirm email (or disable email confirmation in Auth settings)

### Alternative: Sign up in the app
1. Open the app → Sign Up
2. Use any email/password
3. Complete onboarding flow
4. Your account is ready

## Test Data

The seed file (`supabase/seed.sql`) includes 50 cosmetic ingredients for the product catalog. Run it in Supabase SQL Editor to populate reference data.

## Scan Flow Testing

### With Backend Running:
1. Start web app: `pnpm dev` (from repo root)
2. Set `EXPO_PUBLIC_API_URL=http://localhost:3000` in `apps/mobile/.env.local`
3. Start mobile: `cd apps/mobile && pnpm start`
4. Scan flow uses your running web API

### Without Backend (Mock Mode):
1. The mobile app will fail gracefully on scan submission
2. Auth and onboarding work without backend
3. Dashboard shows empty state with "Analyze Your Skin" CTA
