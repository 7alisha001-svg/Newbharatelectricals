const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminSidebar.tsx', 'utf8');

content = content.replace(
  /<img src=\{settings\?\.social_links\?\.footer_logo \|\| "\/footer-logo-light\.png"\} alt=\{settings\?\.business_name \|\| "New Bharat Electricals"\} className="h-10 w-auto object-contain" \/>/g,
  `<img src={settings?.social_links?.footer_logo || "/footer-logo-light.png"} alt={settings?.business_name || "New Bharat Electricals"} className="h-10 w-auto object-contain" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('images.unsplash.com')) target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; }} />`
);

fs.writeFileSync('src/components/admin/AdminSidebar.tsx', content);
