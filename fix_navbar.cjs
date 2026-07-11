const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const target = `                <img 
                  src="/header-logo-dark.png?v=2.0" 
                  alt="New Bharat Electricals" 
                  className="h-14 sm:h-18 md:h-22 lg:h-26 w-auto object-contain group-hover:-translate-y-0.5 transition-transform"
                 onError={(e) => { 
                   const target = e.currentTarget;
                   if (!target.src.includes('images.unsplash.com')) {
                     target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                   }
                 }} />`;

const replacement = `                <img 
                  src={settings?.logo_url || "/header-logo-dark.png"} 
                  alt={settings?.business_name || "New Bharat Electricals"} 
                  style={{ height: settings?.social_links?.header_logo_size ? \`\${settings.social_links.header_logo_size}px\` : undefined }}
                  className={\`\${settings?.social_links?.header_logo_size ? '' : 'h-14 sm:h-18 md:h-22 lg:h-26'} w-auto object-contain group-hover:-translate-y-0.5 transition-transform\`}
                 onError={(e) => { 
                   const target = e.currentTarget;
                   if (!target.src.includes('images.unsplash.com')) {
                     target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                   }
                 }} />`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Navbar.tsx', content);
