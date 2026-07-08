require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

async function run() {
  const { data: brands, error } = await supabase.from('brands').select('*');
  for (let brand of brands) {
    if (!brand.slug) {
      const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await supabase.from('brands').update({ slug }).eq('id', brand.id);
      console.log(`Updated slug for ${brand.name} to ${slug}`);
    }
  }
}
run();
