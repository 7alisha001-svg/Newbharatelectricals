require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data, error } = await supabase.from('brands').select('is_featured').limit(1);
  if (error) {
    console.log("Error querying is_featured, might not exist:", error);
  } else {
    console.log("is_featured exists");
  }
}
run();
