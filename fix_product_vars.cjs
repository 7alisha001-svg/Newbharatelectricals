const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');

code = code.replace(/displayTitle/g, 'product.name');
code = code.replace(/product\.imageUrl/g, 'product.images[0]');

fs.writeFileSync('src/pages/ProductPage.tsx', code);
