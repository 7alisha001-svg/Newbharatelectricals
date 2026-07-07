const fs = require('fs');

function addRefresh(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes("import { useStore } from '../../context/StoreContext';")) {
    if (code.includes("import { Link }")) {
      code = code.replace("import { Link }", "import { Link }\nimport { useStore } from '../../context/StoreContext';");
    } else if (code.includes("import { useParams")) {
      code = code.replace("import { useParams", "import { useStore } from '../../context/StoreContext';\nimport { useParams");
    } else {
      code = code.replace("import React", "import { useStore } from '../../context/StoreContext';\nimport React");
    }
  }

  // Add refreshStore hook
  if (!code.includes("const { refreshStore } = useStore();")) {
    code = code.replace(/const navigate = useNavigate\(\);/g, "const navigate = useNavigate();\n  const { refreshStore } = useStore();");
    if (!code.includes("const { refreshStore }")) {
       // if no navigate
       code = code.replace(/const \[loading, setLoading\] = useState/g, "const { refreshStore } = useStore();\n  const [loading, setLoading] = useState");
    }
  }

  // Inject refreshStore call after successful mutation
  code = code.replace(/if \(error\) throw error;\n\s*setMessage/g, "if (error) throw error;\n      await refreshStore();\n      setMessage");
  
  // For Brands, Categories
  code = code.replace(/await supabase\.from\('brands'\)\.delete\(\)\.eq\('id', id\);\n\s*fetchBrands\(\);/g, "await supabase.from('brands').delete().eq('id', id);\n        await refreshStore();\n        fetchBrands();");
  code = code.replace(/await supabase\.from\('categories'\)\.delete\(\)\.eq\('id', id\);\n\s*fetchCategories\(\);/g, "await supabase.from('categories').delete().eq('id', id);\n        await refreshStore();\n        fetchCategories();");
  code = code.replace(/await supabase\.from\('products'\)\.delete\(\)\.eq\('id', id\);\n\s*fetchProducts\(\);/g, "await supabase.from('products').delete().eq('id', id);\n        await refreshStore();\n        fetchProducts();");

  fs.writeFileSync(file, code);
}

['src/pages/admin/ProductForm.tsx', 'src/pages/admin/BrandForm.tsx', 'src/pages/admin/Products.tsx', 'src/pages/admin/Brands.tsx'].forEach(addRefresh);

// Also Navigation.tsx and Settings.tsx
['src/pages/admin/Navigation.tsx', 'src/pages/admin/Settings.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes("import { useStore }")) {
    code = code.replace("import React", "import { useStore } from '../../context/StoreContext';\nimport React");
  }
  if (!code.includes("const { refreshStore }")) {
    code = code.replace(/const \[loading, setLoading\] = useState/g, "const { refreshStore } = useStore();\n  const [loading, setLoading] = useState");
  }
  code = code.replace(/setMessage\('Settings saved successfully.'\);/g, "await refreshStore();\n      setMessage('Settings saved successfully.');");
  code = code.replace(/setMessage\('Navigation saved successfully.'\);/g, "await refreshStore();\n      setMessage('Navigation saved successfully.');");
  fs.writeFileSync(file, code);
});
