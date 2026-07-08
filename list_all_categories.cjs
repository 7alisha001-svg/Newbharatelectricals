require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data: cats, error } = await supabase.from('categories').select('name, slug');
  console.log('categories:', cats);
  
  const { data: prods, error: err2 } = await supabase.from('products').select('name, category');
  const catSet = new Set(prods.map(p => p.category));
  console.log('product categories:', Array.from(catSet));
}
run();
