-- Fix infinite recursion in admin_users SELECT policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.admin_users;

-- Create a clean policy that allows an admin to read their own profile.
-- (This breaks the recursion because it doesn't query admin_users again)
CREATE POLICY "Admins can read their own profile" ON public.admin_users 
FOR SELECT TO authenticated 
USING (auth.uid() = id);

-- If you need admins to read ALL admin profiles, use a SECURITY DEFINER function to bypass RLS:
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid());
END;
$$;

-- And then you can add this policy if they need to see others:
CREATE POLICY "Admins can read all profiles" ON public.admin_users 
FOR SELECT TO authenticated 
USING (public.is_admin());
