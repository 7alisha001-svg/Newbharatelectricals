import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function test() {
  await supabase.from('categories').insert({ name: 'test', slug: 'test' });
  const { data, error } = await supabase.from('categories').select('*').limit(1);
  console.log(error, Object.keys(data[0] || {}));
  await supabase.from('categories').delete().eq('slug', 'test');
}
test();
