import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Need service role key to get policies, or just query pg_policies using RPC if we have one. We don't have service role key.
