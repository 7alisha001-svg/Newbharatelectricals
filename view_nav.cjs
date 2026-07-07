require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data } = await supabase.from('settings').select('social_links').eq('id', 'global').single();
  console.log(JSON.stringify(data.social_links.navigation, null, 2));
}
run();
