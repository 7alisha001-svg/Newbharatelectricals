const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.example', 'utf8');
const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 'global').single();
  if (error) {
    console.error(error);
    return;
  }
  
  if (data.social_links && data.social_links.locations) {
    let updated = false;
    for (const loc of data.social_links.locations) {
      if (loc.email === 'newbharatelectricals00@gmail.com') {
        loc.email = 'info@newbharatelectricals.com';
        updated = true;
      }
    }
    
    if (updated) {
      const { error: updateError } = await supabase
        .from('settings')
        .update({ social_links: data.social_links })
        .eq('id', 'global');
        
      if (updateError) {
        console.error('Update error:', updateError);
      } else {
        console.log('Database updated successfully.');
      }
    } else {
      console.log('No matching email found in database locations.');
    }
  } else {
    console.log('No locations found in database.');
  }
}
main();
