const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

// Add brands state
code = code.replace(
  "const [categories, setCategories] = useState<any[]>([]);",
  "const [categories, setCategories] = useState<any[]>([]);\n  const [brands, setBrands] = useState<any[]>([]);"
);

// Fetch brands
code = code.replace(
  "fetchCategories();\n    if (isEdit) {",
  "fetchCategories();\n    fetchBrands();\n    if (isEdit) {"
);

const fetchBrandsFunc = `
  const fetchBrands = async () => {
    try {
      const { data } = await supabase.from('brands').select('*').order('name', { ascending: true });
      setBrands(data || []);
    } catch (err) {
      console.error("Error fetching brands", err);
    }
  };
`;

code = code.replace(
  "const fetchCategories = async () => {",
  fetchBrandsFunc + "\n  const fetchCategories = async () => {"
);

// Replace input with select
const brandInputRegex = /<input type="text" name="brand" value=\{formData\.brand\} onChange=\{handleChange\} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none" \/>/g;

const brandSelectHtml = `<select name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none">
                <option value="">Select a brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
                ))}
              </select>`;

code = code.replace(brandInputRegex, brandSelectHtml);

fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
