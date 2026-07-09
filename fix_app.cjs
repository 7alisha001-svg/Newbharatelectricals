const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('const { settings } = useStore();')) {
  content = content.replace(
    "export default function App() {",
    "export default function App() {\n  const { settings } = useStore();"
  );
}

if (!content.includes('link rel="icon"')) {
  content = content.replace(
    "<title>New Bharat Electricals",
    `<title>{settings?.business_name || 'New Bharat Electricals'}</title>\n        {settings?.logo_url && <link rel="icon" type="image/png" href={settings.logo_url} />}`
  );
}

fs.writeFileSync('src/App.tsx', content);
