const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/Brands.tsx', 'utf8');

code = code.replace(
  "import { Plus, Edit2, Trash2 } from 'lucide-react';",
  "import { Plus, Edit2, Trash2 } from 'lucide-react';\nimport { Link } from 'react-router-dom';"
);

code = code.replace(
  "<button className=\"bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center\">\n          <Plus size={18} className=\"mr-2\" />\n          Add Brand\n        </button>",
  "<Link to=\"/admin/brands/new\" className=\"bg-brand-green hover:bg-brand-green-dark text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center\">\n          <Plus size={18} className=\"mr-2\" />\n          Add Brand\n        </Link>"
);

code = code.replace(
  "<button className=\"text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors mr-1\">\n                        <Edit2 size={16} />\n                      </button>",
  "<Link to={`/admin/brands/${brand.id}/edit`} className=\"text-gray-400 hover:text-brand-green p-2 rounded-lg hover:bg-brand-green/10 transition-colors mr-1 inline-block\">\n                        <Edit2 size={16} />\n                      </Link>"
);

fs.writeFileSync('src/pages/admin/Brands.tsx', code);
