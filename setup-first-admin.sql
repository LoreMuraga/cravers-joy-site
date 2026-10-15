-- Run this SQL in Supabase SQL Editor after creating your first admin account
-- Replace 'your-email@example.com' with the actual email you used to sign up

-- This will make the first admin automatically approved as a super_admin
UPDATE admin_users
SET is_approved = true,
    role = 'super_admin',
    approved_at = NOW()
WHERE email = 'your-email@example.com';

-- Or insert directly if the signup didn't create the record:
INSERT INTO admin_users (user_id, email, role, is_approved, approved_at)
SELECT id, email, 'super_admin', true, NOW()
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE
SET is_approved = true,
    role = 'super_admin',
    approved_at = NOW();
