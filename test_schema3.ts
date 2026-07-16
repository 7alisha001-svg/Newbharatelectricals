import { config } from 'dotenv';
config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  console.log('settings:', data ? Object.keys(data) : null);
}
test();
