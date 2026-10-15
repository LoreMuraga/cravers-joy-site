-- Drop existing policies on admin_users
DROP POLICY IF EXISTS "Admin users read access" ON admin_users;
DROP POLICY IF EXISTS "Admin users insert" ON admin_users;
DROP POLICY IF EXISTS "Admin users update" ON admin_users;
DROP POLICY IF EXISTS "Admin users delete" ON admin_users;

-- Create permissive policies for admin_users
-- Allow authenticated users to read admin_users
CREATE POLICY "Admin users read access" ON admin_users FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert admin_users
CREATE POLICY "Admin users insert" ON admin_users FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update admin_users
CREATE POLICY "Admin users update" ON admin_users FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete admin_users
CREATE POLICY "Admin users delete" ON admin_users FOR DELETE
TO authenticated
USING (true);
