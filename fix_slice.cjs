const fs = require('fs');
['src/pages/admin/ProductForm.tsx', 'src/pages/admin/BrandForm.tsx', 'src/pages/admin/Products.tsx', 'src/pages/admin/Brands.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let badStr = "import { Link }import { useStore } from '../../context/StoreContext'; from 'react-router-dom';";
  if (code.includes(badStr)) {
    code = code.replace(badStr, "import { Link } from 'react-router-dom';import { useStore } from '../../context/StoreContext';");
  } else {
    console.log(file + " bad string not found.");
  }
  fs.writeFileSync(file, code);
});
