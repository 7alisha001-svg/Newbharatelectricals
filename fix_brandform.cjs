const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/BrandForm.tsx', 'utf8');

code = code.replace(/image_url/g, 'logo_url');
code = code.replace(/description: '',/g, '');
code = code.replace(/display_order: 0,/g, '');

// remove description and display_order logic
code = code.replace(/description: data.description \|\| '',/g, '');
code = code.replace(/display_order: data.display_order \|\| 0,/g, '');

code = code.replace(/description: formData.description,/g, '');
code = code.replace(/display_order: Number\(formData.display_order\),/g, '');

const descBlockRegex = /<div className="md:col-span-2">\s*<label className="block text-sm font-medium text-gray-700 mb-1">Description<\/label>\s*<textarea[\s\S]*?className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none"\s*\/>\s*<\/div>/g;
code = code.replace(descBlockRegex, '');

const orderBlockRegex = /<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">Display Order<\/label>\s*<input[\s\S]*?className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-green outline-none"\s*\/>\s*<\/div>/g;
code = code.replace(orderBlockRegex, '');

fs.writeFileSync('src/pages/admin/BrandForm.tsx', code);
