const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');
code = code.replace('<td className="p-4 text-gray-600">{product.category || \'-\'}</td>', '<td className="p-4 font-medium text-brand-green">{product.brand || \'-\'}</td>');
fs.writeFileSync('src/pages/admin/Products.tsx', code);
