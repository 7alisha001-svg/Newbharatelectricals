const fs = require('fs');
let code = fs.readFileSync('src/pages/BrandPage.tsx', 'utf8');

code = code.replace(
  '<title>{title} Products <span className="text-sm font-normal text-gray-500 ml-2">({brandProducts.length} Products)</span> | New Bharat Electricals</title>',
  '<title>{title} Products ({brandProducts.length} Products) | New Bharat Electricals</title>'
);

fs.writeFileSync('src/pages/BrandPage.tsx', code);
