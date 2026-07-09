require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data, error } = await supabase.rpc('get_tables');
  if (error) console.log('RPC get_tables error:', error);
}
run();
