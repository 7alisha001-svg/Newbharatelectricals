import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyEmptyProducts() {
  console.log('Verifying products table...');
  const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error checking products:', error.message);
    return;
  }
  
  if (count === 0) {
    console.log('✅ SUCCESS: Products table is completely empty.');
    console.log('You are now ready to run the import-products.sql script to load the fresh catalog.');
  } else {
    console.log(`⚠️ WARNING: There are still ${count} products remaining in the database.`);
    console.log('Please ensure you have run the delete-products.sql script in your Supabase SQL Editor.');
  }
}

verifyEmptyProducts();
