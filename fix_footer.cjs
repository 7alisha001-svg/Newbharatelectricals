const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const target = `<img src="/footer-logo-light.png?v=2.0" alt="New Bharat Electricals" className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px] h-auto object-contain m-0 p-0" onError={(e) => { 
                  const target = e.currentTarget;
                  if (!target.src.includes('images.unsplash.com')) {
                    target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                  }
                }} />`;

const replacement = `<img src={settings?.social_links?.footer_logo || "/footer-logo-light.png"} alt={settings?.business_name || "New Bharat Electricals"} style={{ maxWidth: settings?.social_links?.footer_logo_size ? \`\${settings.social_links.footer_logo_size}px\` : undefined }} className={\`w-full \${settings?.social_links?.footer_logo_size ? '' : 'max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px]'} h-auto object-contain m-0 p-0\`} onError={(e) => { 
                  const target = e.currentTarget;
                  if (!target.src.includes('images.unsplash.com')) {
                    target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                  }
                }} />`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Footer.tsx', content);
