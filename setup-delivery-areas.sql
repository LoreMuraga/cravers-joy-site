-- Insert default delivery areas
INSERT INTO delivery_areas (name, price, is_active) VALUES
  ('Kenyatta Road', 300, true),
  ('Juja', 500, true),
  ('Ruiru', 600, true),
  ('Kahawa', 700, true),
  ('Githurai', 700, true),
  ('Thika', 800, true),
  ('Nairobi CBD', 1000, true)
ON CONFLICT (name) DO NOTHING;
