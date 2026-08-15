-- Run this script in your Supabase SQL Editor to create the required tables

-- 1. Inquiries Table (For Contact Form)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    inquiry_type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to inquiries
CREATE POLICY "Allow anonymous inserts to inquiries" 
ON public.inquiries FOR INSERT 
TO anon 
WITH CHECK (true);

-- 2. Orders Table (For Checkout Page)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    cart_items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to orders
CREATE POLICY "Allow anonymous inserts to orders" 
ON public.orders FOR INSERT 
TO anon 
WITH CHECK (true);

-- 3. Inquiry creation helper (returns inserted id without requiring frontend SELECT)
CREATE OR REPLACE FUNCTION public.create_inquiry(
  p_name text,
  p_phone text,
  p_inquiry_type text,
  p_message text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.inquiries (name, phone, inquiry_type, message)
  VALUES (p_name, p_phone, p_inquiry_type, p_message)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_inquiry(text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.create_inquiry(text, text, text, text) TO authenticated;
