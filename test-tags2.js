import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function test() {
  const { data, error } = await supabase.from('products').update({ tags: { a: 1 } }).eq('id', '1bd834ac-9692-47d0-8b3b-cc0f075cc7c8');
  console.log(error);
}
test();
