const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminSidebar.tsx', 'utf-8');

if (!content.includes('const { settings } = useStore();')) {
  content = content.replace(
    "setIsOpen: (v: boolean) => void\n}) {",
    "setIsOpen: (v: boolean) => void\n}) {\n  const { settings } = useStore();"
  );
}

fs.writeFileSync('src/components/admin/AdminSidebar.tsx', content);
