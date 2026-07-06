import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://placeholder.supabase.co', 'placeholder');

async function test() {
  try {
    const { data, error } = await supabase.from('orders').insert([{
      order_id: '123'
    }]);
    console.log('Error:', error);
  } catch (err) {
    console.log('Exception:', err.message);
  }
}

test();
