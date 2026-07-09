const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

content = content.replace(
  'src="/logo-light.png"',
  'src={settings?.logo_url || "/logo-light.png"}'
);

fs.writeFileSync('src/components/Navbar.tsx', content);
