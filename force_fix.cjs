const fs = require('fs');

['src/pages/admin/ProductForm.tsx', 'src/pages/admin/BrandForm.tsx', 'src/pages/admin/Products.tsx', 'src/pages/admin/Brands.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let newCode = "";
  for (let line of code.split('\n')) {
    if (line.includes("import { Link }import { useStore }")) {
      newCode += "import { Link } from 'react-router-dom';\nimport { useStore } from '../../context/StoreContext';\n";
    } else {
      newCode += line + "\n";
    }
  }
  fs.writeFileSync(file, newCode);
});
