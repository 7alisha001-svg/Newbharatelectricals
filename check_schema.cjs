const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ftxyuhwejcqxoyhmkczl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) console.error('Error:', error);
  else {
    if (data.length > 0) console.log(Object.keys(data[0]));
    else console.log('No data, checking schema another way');
  }
}
check();
