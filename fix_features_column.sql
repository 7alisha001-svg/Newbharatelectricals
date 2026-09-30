-- Fix Key Features persistence.
--
-- Root cause: public.products.features exists, but it was NOT created as JSONB.
-- `alter_products.sql` uses `ADD COLUMN IF NOT EXISTS features JSONB`, so when the
-- column already existed as a text column that statement was silently skipped.
--
-- Effect: writes succeeded (PostgREST coerced the JSON array into its text form),
-- so the admin panel reported success, but reads came back as the string "[]" or
-- '["a","b"]' instead of an array, and every reader that expects an array
-- (Array.isArray) rendered no Key Features at all.
--
-- This migration converts the existing values to real JSON arrays and then
-- converts the column to JSONB. It is idempotent and safe to re-run.

DO $$
DECLARE
  row_record RECORD;
  converted JSONB;
BEGIN
  -- Normalise every existing value into a JSON array of strings first, so the
  -- type conversion below can never fail on malformed / non-JSON text.
  FOR row_record IN SELECT id, features FROM public.products LOOP
    BEGIN
      converted := row_record.features::jsonb;
      IF jsonb_typeof(converted) <> 'array' THEN
        converted := to_jsonb(ARRAY[]::text[]);
      END IF;
    EXCEPTION WHEN others THEN
      converted := to_jsonb(ARRAY[]::text[]);
    END;

    UPDATE public.products
       SET features = converted::text
     WHERE id = row_record.id
       AND features IS DISTINCT FROM converted::text;
  END LOOP;
END $$;

ALTER TABLE public.products ALTER COLUMN features SET DEFAULT '[]'::jsonb;
ALTER TABLE public.products ALTER COLUMN features SET DATA TYPE JSONB USING features::jsonb;

-- Keep the JSON array shape for anything written outside the app.
CREATE OR REPLACE FUNCTION public.products_features_is_array()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.features IS NULL THEN
    NEW.features := '[]'::jsonb;
  ELSIF jsonb_typeof(NEW.features) <> 'array' THEN
    NEW.features := to_jsonb(ARRAY[]::text[]);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_features_is_array ON public.products;
CREATE TRIGGER products_features_is_array
BEFORE INSERT OR UPDATE OF features ON public.products
FOR EACH ROW EXECUTE FUNCTION public.products_features_is_array();

-- No schema caching left: make PostgREST reload the schema.
NOTIFY pgrst, 'reload schema';