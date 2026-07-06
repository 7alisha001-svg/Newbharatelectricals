-- The current policy only allows 'anon' role to insert orders.
-- If you are logged in (e.g. as an admin) and try to test the checkout, your role is 'authenticated'.
-- Without a policy for 'authenticated', the insert will fail with a Row-Level Security error.

-- 1. Create a policy to allow authenticated users to also insert orders
CREATE POLICY "Allow authenticated inserts to orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);

-- Alternatively, you could drop the 'anon' policy and create one for 'public' (which includes everyone)
-- DROP POLICY IF EXISTS "Allow anonymous inserts to orders" ON public.orders;
-- CREATE POLICY "Allow all inserts to orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
