-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  emoji TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cakes table
CREATE TABLE cakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  tag TEXT,
  description TEXT,
  price_type TEXT NOT NULL, -- 'kg', 'each', 'from', 'tier', 'flav'
  base_price DECIMAL(10,2) NOT NULL,
  min_quantity INTEGER DEFAULT 1,
  notice_days INTEGER DEFAULT 1,
  emoji TEXT,
  unit_label TEXT, -- e.g., 'Dozens', 'Boxes', 'Guests'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carousel slides table
CREATE TABLE carousel_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  price_text TEXT,
  image_url TEXT,
  emoji TEXT,
  category_name TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table
CREATE TABLE banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  is_offer BOOLEAN DEFAULT false,
  discount_percentage INTEGER,
  custom_price_list JSONB,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  location TEXT,
  review TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery areas table
CREATE TABLE delivery_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flavors table
CREATE TABLE flavors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price_per_kg DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for approval system)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- 'super_admin' or 'admin'
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES admin_users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cakes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON carousel_slides FOR SELECT USING (true);
CREATE POLICY "Public read access" ON banners FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON delivery_areas FOR SELECT USING (true);
CREATE POLICY "Public read access" ON flavors FOR SELECT USING (true);

-- Admin access policies (you'll need to set up auth for these)
CREATE POLICY "Admin full access" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON cakes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON carousel_slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON delivery_areas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON flavors FOR ALL USING (auth.role() = 'authenticated');

-- Admin users policies
CREATE POLICY "Admin users read access" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin users insert" ON admin_users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin users update" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin users delete" ON admin_users FOR DELETE USING (auth.role() = 'authenticated');
