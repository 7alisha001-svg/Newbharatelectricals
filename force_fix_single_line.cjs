const fs = require('fs');

['src/pages/admin/ProductForm.tsx', 'src/pages/admin/BrandForm.tsx', 'src/pages/admin/Products.tsx', 'src/pages/admin/Brands.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace("import { Link }import { useStore } from '../../context/StoreContext'; from 'react-router-dom';", "import { Link } from 'react-router-dom';import { useStore } from '../../context/StoreContext';");
  fs.writeFileSync(file, code);
});
