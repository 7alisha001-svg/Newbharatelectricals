require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data, error } = await supabase.from('settings').select('*').limit(1);
  if (error) {
    console.error('Error fetching settings:', error);
    return;
  }
  if (!data || data.length === 0) {
    console.log('No settings record found');
    return;
  }
  const record = data[0];
  console.log('=== SETTINGS METADATA ===');
  console.log('ID:', record.id);
  console.log('Business Name:', record.business_name);
  console.log('Logo URL Type:', typeof record.logo_url);
  console.log('Logo URL Length:', record.logo_url ? record.logo_url.length : 0);
  if (record.logo_url) {
    console.log('Logo URL Prefix (first 100 chars):', record.logo_url.substring(0, 100));
  }
  console.log('Email:', record.email);
  console.log('Phone:', record.phone);
  console.log('Social Links:', JSON.stringify(record.social_links, null, 2));
}
run();

