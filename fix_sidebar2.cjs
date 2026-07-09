const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminSidebar.tsx', 'utf-8');

if (!content.includes('const { settings } = useStore();')) {
  content = content.replace(
    "const location = useLocation();",
    "const { settings } = useStore();\n  const location = useLocation();"
  );
}

fs.writeFileSync('src/components/admin/AdminSidebar.tsx', content);
