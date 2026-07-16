import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');
async function test() {
  const { data, error } = await supabase.from('inquiries').insert([{
    name: 'Test',
    phone: '123',
    inquiry_type: 'Quote Request',
    status: 'New',
    message: '{}'
  }]).select();
  console.log('Inquiries Insert:', data, error);
}
test();
