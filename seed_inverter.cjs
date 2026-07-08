require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data: prod, error } = await supabase.from('products').insert([
    {
      name: 'Test Inverter',
      category: 'Inverter',
      slug: 'test-inverter',
      status: 'publish',
      regular_price: 1000,
      sale_price: 800,
      stock_quantity: 10,
      description: 'Test',
      image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop'
    }
  ]).select();
  console.log('Inserted:', prod, error);
}
run();
