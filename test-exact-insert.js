import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
  const cartTotal = NaN; // wait, is cartTotal NaN?

  const { data, error: dbError } = await supabase
    .from('orders')
    .insert([{ 
      order_id: orderId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'j@e.com',
      phone: '123',
      address: 'Addr',
      city: 'City',
      state: 'State',
      pincode: '123',
      payment_method: 'upi',
      total_amount: 100, // let's try with 100 first
      cart_items: []
    }]);
    
  console.log('Error with 100:', dbError);
  
  const { data: d2, error: dbError2 } = await supabase
    .from('orders')
    .insert([{ 
      order_id: orderId + '2',
      first_name: 'John',
      last_name: 'Doe',
      email: 'j@e.com',
      phone: '123',
      address: 'Addr',
      city: 'City',
      state: 'State',
      pincode: '123',
      payment_method: 'upi',
      total_amount: NaN, // try with NaN
      cart_items: []
    }]);

  console.log('Error with NaN:', dbError2);
}

test();
