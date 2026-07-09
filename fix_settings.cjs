const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf-8');

// add ImageUploader import
content = content.replace(
  "import { Save } from 'lucide-react';",
  "import { Save } from 'lucide-react';\nimport ImageUploader from '../../components/admin/ImageUploader';"
);

// update setSettings initial state to include logo_url and social_links
content = content.replace(
  /const \[settings, setSettings\] = useState<any>\(\{/,
  "const [settings, setSettings] = useState<any>({\n    logo_url: '',\n    social_links: {},"
);

// add image upload components
const imageUploaders = `
          <div className="md:col-span-2 space-y-4">
             <label className="block text-sm font-medium text-gray-700">Header Logo (Light Logo)</label>
             <ImageUploader 
               images={settings.logo_url ? [settings.logo_url] : []} 
               onChange={(urls) => setSettings({...settings, logo_url: urls.length > 0 ? urls[0] : null})} 
             />
          </div>
          <div className="md:col-span-2 space-y-4">
             <label className="block text-sm font-medium text-gray-700">Footer Logo (Dark Logo)</label>
             <ImageUploader 
               images={settings.social_links?.footer_logo ? [settings.social_links.footer_logo] : []} 
               onChange={(urls) => setSettings({
                 ...settings, 
                 social_links: {
                   ...settings.social_links, 
                   footer_logo: urls.length > 0 ? urls[0] : null
                 }
               })} 
             />
          </div>
`;

content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/,
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-6">' + imageUploaders
);

fs.writeFileSync('src/pages/admin/Settings.tsx', content);
