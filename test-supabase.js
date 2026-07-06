import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('orders').insert([{
    order_id: 'TEST1234',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
    payment_method: 'upi',
    total_amount: 1000,
    cart_items: []
  }]);
  console.log('Result:', data);
  console.log('Error:', error);
}

test();
