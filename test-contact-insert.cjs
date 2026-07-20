const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ftxyuhwejcqxoyhmkczl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const payloadData = {
    email: 'test@example.com',
    company: 'Test Co',
    status: 'New',
    is_contact: true,
    message: 'Hello'
  };

  const { data, error } = await supabase
    .from('inquiries')
    .insert([{ 
      name: 'Test Name', 
      phone: '1234567890', 
      inquiry_type: 'General', 
      message: JSON.stringify(payloadData)
    }]);

  console.log('Error:', error);
  console.log('Data:', data);
}
test();
