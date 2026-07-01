-- Fix Admin Authentication and RLS

-- 1. Create a secure RPC function to check if admin exists
CREATE OR REPLACE FUNCTION public.check_if_admin_exists()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users);
END;
$$;

-- 2. Create a secure RPC function to insert the first admin
-- This bypasses RLS since it's SECURITY DEFINER, avoiding the WITH CHECK infinite loop
CREATE OR REPLACE FUNCTION public.setup_first_admin(admin_id UUID, admin_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Double check that no admin exists
  IF EXISTS (SELECT 1 FROM public.admin_users) THEN
    RETURN jsonb_build_object('success', false, 'message', 'An admin account already exists.');
  END IF;

  -- Insert the new admin
  INSERT INTO public.admin_users (id, email)
  VALUES (admin_id, admin_email);

  RETURN jsonb_build_object('success', true, 'message', 'Admin account created successfully.');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- 3. Reset RLS policies on admin_users
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow initial admin creation" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can read own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_users;

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Select Policy: Admins can only read their own profile
CREATE POLICY "Admins can read own profile"
ON public.admin_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 5. Update Policy: Admins can only update their own profile
CREATE POLICY "Admins can update own profile"
ON public.admin_users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Insert Policy: Disable direct inserts from the client
-- The setup_first_admin RPC function will handle the insertion
CREATE POLICY "Disable direct inserts"
ON public.admin_users FOR INSERT
TO authenticated
WITH CHECK (false);

-- 7. Delete Policy: Disable direct deletions from the client
CREATE POLICY "Disable direct deletions"
ON public.admin_users FOR DELETE
TO authenticated
USING (false);
