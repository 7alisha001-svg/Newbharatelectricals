require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const settingsRes = await supabase.from('settings').select('*').eq('id', 'global').single();
  const socialLinks = settingsRes.data.social_links || {};
  socialLinks.featured_brands = ['amaze', 'luminous', 'microtek', 'livguard', 'exide'];
  const { data, error } = await supabase.from('settings').update({ social_links: socialLinks }).eq('id', 'global');
  console.log('Update result:', data, error);
}
run();
