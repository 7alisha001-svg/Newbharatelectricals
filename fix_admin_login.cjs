const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf-8');

if (!content.includes('useStore')) {
  content = "import { useStore } from '../../context/StoreContext';\n" + content;
}

if (!content.includes('const { settings } = useStore();')) {
  content = content.replace(
    "export default function AdminLogin() {",
    "export default function AdminLogin() {\n  const { settings } = useStore();"
  );
}

content = content.replace(
  'src="/logo-light.png"',
  'src={settings?.logo_url || "/logo-light.png"}'
);

fs.writeFileSync('src/pages/admin/AdminLogin.tsx', content);
