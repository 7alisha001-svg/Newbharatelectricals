require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://ftxyuhwejcqxoyhmkczl.supabase.co', process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6wykfsdrjqNFsREjd8Johg_uGcFLqse');

const brandList = [
  "Amaze",
  "Luminous",
  "Microtek",
  "Okaya",
  "Exide",
  "Livguard",
  "Amaron",
  "SF Sonic",
  "Genus",
  "Sukam",
  "Eastman"
];

async function run() {
  const { data: existingBrands } = await supabase.from('brands').select('*');
  const existingNames = existingBrands?.map(b => b.name) || [];

  for (const b of brandList) {
    if (!existingNames.includes(b)) {
      const slug = b.toLowerCase().replace(/\s+/g, '-');
      await supabase.from('brands').insert({ 
        id: slug + '-' + Math.random().toString(36).substring(2, 6),
        name: b,
        slug: slug
      });
      console.log("Inserted brand:", b);
    }
  }
  console.log("Brands seeded.");
}
run();
