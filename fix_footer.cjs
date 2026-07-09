const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// we need useStore for settings in Footer
if (!content.includes('useStore')) {
  content = content.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { useStore } from '../context/StoreContext';"
  );
  if (!content.includes('useStore')) {
    content = "import { useStore } from '../context/StoreContext';\n" + content;
  }
}

if (!content.includes('const { settings } = useStore();')) {
  content = content.replace(
    "export default function Footer() {",
    "export default function Footer() {\n  const { settings } = useStore();"
  );
}

content = content.replace(
  'src="/logo-dark.png"',
  'src={settings?.social_links?.footer_logo || "/logo-dark.png"}'
);

fs.writeFileSync('src/components/Footer.tsx', content);
