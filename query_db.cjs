const { createClient } = require('@supabase/supabase-js');
const url = 'https://ftxyuhwejcqxoyhmkczl.supabase.co';
const key = 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse';
const supabase = createClient(url, key);

async function run() {
  const { data: prods, error } = await supabase.from('products').select('*');
  console.log('error', error);
  console.log('products first element keys', prods ? Object.keys(prods[0]) : null);
}
run();
