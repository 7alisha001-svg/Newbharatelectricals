const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');
let idx = code.indexOf("import { Link }");
console.log(code.substring(idx, idx + 100));
