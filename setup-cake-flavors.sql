-- Create cake_flavors table to manage flavors for each cake
CREATE TABLE IF NOT EXISTS cake_flavors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cake_id UUID NOT NULL REFERENCES cakes(id) ON DELETE CASCADE,
  flavor_name VARCHAR(100) NOT NULL,
  price_adjustment INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cake_id, flavor_name)
);

-- Enable RLS
ALTER TABLE cake_flavors ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admins to manage flavors
CREATE POLICY "Admins can manage cake flavors"
ON cake_flavors
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  )
);

-- Policy: Public can view active flavors
CREATE POLICY "Public can view active cake flavors"
ON cake_flavors
FOR SELECT
TO public
USING (is_active = true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cake_flavors_cake_id ON cake_flavors(cake_id);
CREATE INDEX IF NOT EXISTS idx_cake_flavors_active ON cake_flavors(is_active);
