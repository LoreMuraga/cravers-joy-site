-- Approve developer account for elvismickgitau@gmail.com
INSERT INTO admin_users (user_id, email, role, is_approved, approved_at)
SELECT id, email, 'super_admin', true, NOW()
FROM auth.users
WHERE email = 'elvismickgitau@gmail.com'
ON CONFLICT (user_id) DO UPDATE
SET is_approved = true,
    role = 'super_admin',
    approved_at = NOW();
