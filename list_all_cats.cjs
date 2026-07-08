require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data: cats, error } = await supabase.from('categories').select('*');
  console.log('categories:', cats.map(c => c.name + ' (' + c.slug + ')'));
}
run();
