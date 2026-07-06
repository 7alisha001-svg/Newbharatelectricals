CREATE OR REPLACE FUNCTION public.create_first_admin(
  admin_id UUID,
  admin_email TEXT,
  admin_full_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if any admin already exists
  IF EXISTS (SELECT 1 FROM public.admin_users) THEN
    RAISE EXCEPTION 'An admin already exists. Cannot create a new one via this method.';
  END IF;

  -- Insert the new admin
  INSERT INTO public.admin_users (id, email, full_name, role)
  VALUES (admin_id, admin_email, admin_full_name, 'super_admin');
END;
$$;
