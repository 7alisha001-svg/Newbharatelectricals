-- Fix Admin Authentication and RLS Policies

-- 1. Create a secure function to check if an admin exists (bypasses RLS)
-- This is necessary because if we just check the table directly in a policy, 
-- it would be subject to the SELECT policy, creating an infinite loop or false negatives.
CREATE OR REPLACE FUNCTION public.check_if_admin_exists()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users);
END;
$$;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow initial admin creation" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can read own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Disable direct inserts" ON public.admin_users;
DROP POLICY IF EXISTS "Disable direct deletions" ON public.admin_users;

-- 3. Ensure RLS is enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. INSERT Policy: Allow an authenticated user to insert a row ONLY if the table is empty
CREATE POLICY "Allow initial admin creation" 
ON public.admin_users FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.uid() = id AND NOT public.check_if_admin_exists()
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

-- 7. DELETE Policy: Prevent deletions
CREATE POLICY "Prevent admin deletion"
ON public.admin_users FOR DELETE
TO authenticated
USING (false);
