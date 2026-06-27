-- WooCommerce Admin Dashboard SQL Setup

-- 1. Create Admins table (to restrict registration after 1 user)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to authenticated users" 
ON public.admin_users FOR SELECT 
TO authenticated 
USING (true);

-- Trigger to automatically add the first user to admin_users, and block subsequent if needed
-- Actually, a simpler way is just to check if count > 0 in the application code when trying to register.

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    description TEXT,
    short_description TEXT,
    regular_price NUMERIC NOT NULL,
    sale_price NUMERIC,
    stock_quantity INTEGER DEFAULT 0,
    manage_stock BOOLEAN DEFAULT false,
    stock_status TEXT DEFAULT 'instock', -- 'instock', 'outofstock', 'onbackorder'
    low_stock_amount INTEGER DEFAULT 5,
    weight NUMERIC,
    dimensions JSONB, -- { length, width, height }
    category TEXT,
    brand TEXT,
    tags TEXT[],
    image_url TEXT,
    gallery_images TEXT[],
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'publish', -- 'publish', 'draft'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to manage products" 
ON public.products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    billing_address JSONB,
    shipping_address JSONB,
    total_spent NUMERIC DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to customers" 
ON public.customers FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to manage customers" 
ON public.customers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL, -- Will reference orders.id
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    total NUMERIC NOT NULL
);

-- Note: We already have an orders table from previous steps, but let's update it or recreate if not exists
-- If orders table exists from before, we need to add a status column to it.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='status') THEN
        ALTER TABLE public.orders ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='customer_id') THEN
        ALTER TABLE public.orders ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
    END IF;
END $$;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to order_items" 
ON public.order_items FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Allow authenticated users to manage order_items" 
ON public.order_items FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for existing orders table for admin access
CREATE POLICY "Allow authenticated users to manage orders" 
ON public.orders FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update product stock on order completion
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Basic placeholder function for stock deduction. We can handle stock updates in JS application logic for finer control.
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
