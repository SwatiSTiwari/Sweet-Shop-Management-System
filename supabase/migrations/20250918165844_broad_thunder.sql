/*
  # Create Sweet Shop Management System Tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `password_hash` (text, not null)
      - `role` (text, not null, default 'customer')
      - `created_at` (timestamptz, default now())

    - `sweets`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `category` (text, not null)
      - `price` (decimal, not null)
      - `quantity` (integer, not null, default 0)
      - `description` (text, default '')
      - `image_url` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authentication and role-based access
    - Users can only access their own data
    - Admin users have full access to sweets management
    - Customers can view sweets and make purchases

  3. Indexes
    - Index on users email for faster authentication
    - Index on sweets category and price for filtering
    - Index on sweets name for search functionality
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now()
);

-- Create sweets table
CREATE TABLE IF NOT EXISTS sweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  description text DEFAULT '',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category);
CREATE INDEX IF NOT EXISTS idx_sweets_price ON sweets(price);
CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name);
CREATE INDEX IF NOT EXISTS idx_sweets_quantity ON sweets(quantity);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sweets ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Sweets table policies
CREATE POLICY "Everyone can view sweets"
  ON sweets
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin users can insert sweets"
  ON sweets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can update sweets"
  ON sweets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin users can delete sweets"
  ON sweets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_sweets_updated_at 
  BEFORE UPDATE ON sweets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO sweets (name, category, price, quantity, description, image_url) VALUES
  ('Chocolate Brownie', 'Chocolate', 4.99, 25, 'Rich, fudgy chocolate brownie with walnuts', 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg'),
  ('Strawberry Cupcake', 'Cupcakes', 3.50, 30, 'Fluffy vanilla cupcake with fresh strawberry frosting', 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg'),
  ('Lemon Tart', 'Pastries', 5.25, 15, 'Tangy lemon curd in a buttery pastry shell', 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'),
  ('Red Velvet Cake Slice', 'Cakes', 6.75, 12, 'Classic red velvet cake with cream cheese frosting', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'),
  ('Chocolate Chip Cookies', 'Cookies', 2.99, 50, 'Fresh-baked cookies with premium chocolate chips', 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg'),
  ('Vanilla Macarons', 'Macarons', 8.99, 20, 'Delicate French macarons with vanilla ganache filling', 'https://images.pexels.com/photos/1028704/pexels-photo-1028704.jpeg'),
  ('Apple Pie Slice', 'Pies', 4.50, 18, 'Traditional apple pie with cinnamon and sugar', 'https://images.pexels.com/photos/1055271/pexels-photo-1055271.jpeg'),
  ('Chocolate Truffles', 'Chocolate', 12.99, 35, 'Handmade chocolate truffles with various fillings', 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg'),
  ('Blueberry Muffin', 'Muffins', 3.25, 28, 'Fresh blueberry muffin with streusel topping', 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg'),
  ('Caramel Fudge', 'Fudge', 7.50, 22, 'Creamy caramel fudge made with real butter', 'https://images.pexels.com/photos/1161547/pexels-photo-1161547.jpeg');

-- Create admin user (password: admin123)
INSERT INTO users (email, password_hash, role) VALUES 
  ('admin@sweetshop.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBk0WpkQXIjBhK', 'admin');

-- Create sample customer (password: customer123)  
INSERT INTO users (email, password_hash, role) VALUES 
  ('customer@example.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');