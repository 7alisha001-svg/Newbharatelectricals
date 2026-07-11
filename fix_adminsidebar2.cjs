const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminSidebar.tsx', 'utf8');

content = content.replace(
  "export default function AdminSidebar({ \n  isOpen, \n  setIsOpen \n}: { \n  isOpen: boolean, \n  setIsOpen: (v: boolean) => void \n}) {",
  "export default function AdminSidebar({ \n  isOpen, \n  setIsOpen \n}: { \n  isOpen: boolean, \n  setIsOpen: (v: boolean) => void \n}) {\n  const { settings } = useStore();"
);

fs.writeFileSync('src/components/admin/AdminSidebar.tsx', content);
