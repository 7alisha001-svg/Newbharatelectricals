require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data: prods, error: err2 } = await supabase.from('products').select('name, brand');
  const brandsSet = new Set(prods.map(p => p.brand));
  console.log('product brands in use:', Array.from(brandsSet));
}
run();
