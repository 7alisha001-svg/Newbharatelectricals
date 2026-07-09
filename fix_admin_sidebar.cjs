const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminSidebar.tsx', 'utf-8');

if (!content.includes('useStore')) {
  content = "import { useStore } from '../../context/StoreContext';\n" + content;
}

if (!content.includes('const { settings } = useStore();')) {
  content = content.replace(
    "export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {",
    "export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {\n  const { settings } = useStore();"
  );
}

content = content.replace(
  'src="/logo-dark.png"',
  'src={settings?.social_links?.footer_logo || "/logo-dark.png"}'
);

fs.writeFileSync('src/components/admin/AdminSidebar.tsx', content);
