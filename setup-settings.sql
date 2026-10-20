-- Create settings table for policies
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Insert empty settings (admin will fill these)
INSERT INTO settings (key, value) VALUES
  ('terms_of_service', ''),
  ('cancellation_policy', ''),
  ('privacy_policy', '')
ON CONFLICT (key) DO NOTHING;

-- Update admin_users table to include role
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL;

-- Update existing admin to superadmin if none exists
UPDATE admin_users SET role = 'superadmin' WHERE role IS NULL OR role = '';
