const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminSidebar.tsx', 'utf8');

if (!content.includes('useStore')) {
  content = content.replace(
    "import { supabase } from '../../lib/supabase';",
    "import { supabase } from '../../lib/supabase';\nimport { useStore } from '../../context/StoreContext';"
  );
}

content = content.replace(
  "export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {",
  "export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {\n  const { settings } = useStore();"
);

content = content.replace(
  /<img src="\/footer-logo-light\.png\?v=2\.0" alt="New Bharat Electricals" className="h-10 w-auto object-contain" \/>/g,
  `<img src={settings?.social_links?.footer_logo || "/footer-logo-light.png"} alt={settings?.business_name || "New Bharat Electricals"} className="h-10 w-auto object-contain" />`
);

fs.writeFileSync('src/components/admin/AdminSidebar.tsx', content);
