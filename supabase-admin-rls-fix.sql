-- Fix RLS for admin_users table

-- 1. Create a secure function to check if an admin exists (bypasses RLS to return a simple true/false)
CREATE OR REPLACE FUNCTION public.check_if_admin_exists()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users);
END;
$$;

-- 2. Drop any existing policies on admin_users to start fresh
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow initial admin creation" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can read own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_users;

-- 3. Enable RLS (if not already enabled)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. INSERT Policy: Allow an authenticated user to insert a row ONLY if the table is empty
CREATE POLICY "Allow initial admin creation" 
ON public.admin_users FOR INSERT 
TO authenticated 
WITH CHECK (
    NOT public.check_if_admin_exists()
);

-- 5. SELECT Policy: Admins can only read their own profile record
CREATE POLICY "Admins can read own profile"
ON public.admin_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 6. UPDATE Policy: Admins can only update their own profile record
CREATE POLICY "Admins can update own profile"
ON public.admin_users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
