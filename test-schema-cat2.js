import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function test() {
  const { data, error } = await supabase.from('categories').insert({ non_existent_column: 1 });
  console.log(error);
}
test();
