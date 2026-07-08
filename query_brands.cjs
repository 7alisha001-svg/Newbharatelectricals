require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data: brands, error } = await supabase.from('brands').select('*').limit(1);
  console.log('brands first element keys', brands ? Object.keys(brands[0] || {}) : null);
}
run();
