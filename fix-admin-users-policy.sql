-- Drop existing policies
DROP POLICY IF EXISTS "Admin users read access" ON admin_users;
DROP POLICY IF EXISTS "Admin users insert" ON admin_users;
DROP POLICY IF EXISTS "Admin users update" ON admin_users;
DROP POLICY IF EXISTS "Admin users delete" ON admin_users;

-- Create new policies that allow inserts during signup
CREATE POLICY "Admin users read access" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin users insert" ON admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin users update" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin users delete" ON admin_users FOR DELETE USING (auth.role() = 'authenticated');
