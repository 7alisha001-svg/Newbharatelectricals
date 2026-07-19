const fs = require('fs');
let content = fs.readFileSync('src/components/BrandsSection.tsx', 'utf8');

content = content.replace(
  "const featuredBrandSlugs = settings?.social_links?.featured_brands || [];",
  "const rawSlugs = settings?.social_links?.featured_brands; const featuredBrandSlugs = Array.isArray(rawSlugs) ? rawSlugs : [];"
);

fs.writeFileSync('src/components/BrandsSection.tsx', content);
