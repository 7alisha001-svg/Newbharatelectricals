import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('orders').insert([{
    order_id: 'ORD' + Date.now(),
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'City',
    state: 'State',
    pincode: '123456',
    payment_method: 'upi',
    total_amount: 937000,
    cart_items: []
  }]).select();
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
