import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ftxyuhwejcqxoyhmkczl.supabase.co';
const supabaseAnonKey = 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: brands } = await supabase.from('brands').select('*');
  const { data: products } = await supabase.from('products').select('*');

  console.log('=== CATEGORIES ===');
  console.log(JSON.stringify(categories, null, 2));

  console.log('=== BRANDS ===');
  console.log(JSON.stringify(brands, null, 2));

  console.log('=== PRODUCTS ===');
  console.log(JSON.stringify(products, null, 2));
}

run();
