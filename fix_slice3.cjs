const fs = require('fs');
['src/pages/admin/ProductForm.tsx', 'src/pages/admin/BrandForm.tsx', 'src/pages/admin/Products.tsx', 'src/pages/admin/Brands.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let idx = code.indexOf("import { Link }import { useStore }");
  if (idx !== -1) {
    let endIdx = code.indexOf("from 'react-router-dom';", idx);
    let str = code.substring(idx, endIdx + "from 'react-router-dom';".length);
    console.log("Found:", str);
    code = code.replace(str, "import { Link } from 'react-router-dom';import { useStore } from '../../context/StoreContext';");
    fs.writeFileSync(file, code);
  }
});
