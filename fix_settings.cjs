const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/Settings.tsx', 'utf8');
content = content.replace(
  /<ImageUploader\s+images=\{settings\.logo_url \? \[settings\.logo_url\] : \[\]\}\s+onChange=\{\(urls\) => setSettings\(\{\.\.\.settings, logo_url: urls\.length > 0 \? urls\[0\] : null\}\)\}\s+\/>/g,
  `$&\n             <div className="mt-4">\n               <label className="block text-sm font-medium text-gray-700 mb-1">Header Logo Height ({settings.social_links?.header_logo_size || 80}px)</label>\n               <input type="range" min="40" max="160" step="4"\n                 value={settings.social_links?.header_logo_size || 80}\n                 onChange={(e) => setSettings({...settings, social_links: {...settings.social_links, header_logo_size: parseInt(e.target.value)}})}\n                 className="w-full"\n               />\n             </div>`
);

content = content.replace(
  /<ImageUploader\s+images=\{settings\.social_links\?\.footer_logo \? \[settings\.social_links\.footer_logo\] : \[\]\}\s+onChange=\{\(urls\) => setSettings\(\{\s+\.\.\.settings,\s+social_links: \{\s+\.\.\.settings\.social_links,\s+footer_logo: urls\.length > 0 \? urls\[0\] : null\s+\}\s+\}\)\}\s+\/>/g,
  `$&\n             <div className="mt-4">\n               <label className="block text-sm font-medium text-gray-700 mb-1">Footer Logo Max Width ({settings.social_links?.footer_logo_size || 240}px)</label>\n               <input type="range" min="100" max="500" step="10"\n                 value={settings.social_links?.footer_logo_size || 240}\n                 onChange={(e) => setSettings({...settings, social_links: {...settings.social_links, footer_logo_size: parseInt(e.target.value)}})}\n                 className="w-full"\n               />\n             </div>`
);

fs.writeFileSync('src/pages/admin/Settings.tsx', content);
