const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

// remove category from form
const categoryHtml = `            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none">
                <option value="">Select Category</option>
                {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
              </select>
            </div>`;
            
code = code.replace(categoryHtml, '');

// Make brand required
code = code.replace(
  '<select name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none">',
  '<select name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none">'
);
code = code.replace(
  '<label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>',
  '<label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>'
);

// We can also remove `fetchCategories` logic from ProductForm.tsx, though leaving it doesn't break things. Let's just remove the state.
code = code.replace(
  "  const [categories, setCategories] = useState<any[]>([]);\n",
  ""
);

// We'll leave `category: ''` in formData just in case so it doesn't break TypeScript, but we can also remove it.
fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
