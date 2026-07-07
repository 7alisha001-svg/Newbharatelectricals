const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import BrandForm")) {
  code = code.replace("import Brands from './pages/admin/Brands';", "import Brands from './pages/admin/Brands';\nimport BrandForm from './pages/admin/BrandForm';");
}

if (!code.includes("<Route path=\"brands/new\"")) {
  code = code.replace(
    "<Route path=\"brands\" element={<Brands />} />",
    "<Route path=\"brands\" element={<Brands />} />\n              <Route path=\"brands/new\" element={<BrandForm />} />\n              <Route path=\"brands/:id/edit\" element={<BrandForm />} />"
  );
}

fs.writeFileSync('src/App.tsx', code);
