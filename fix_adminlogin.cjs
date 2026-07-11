const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');

if (!content.includes('const [logoUrl, setLogoUrl] = useState')) {
  content = content.replace(
    "const [adminExists, setAdminExists] = useState<boolean | null>(null);",
    "const [adminExists, setAdminExists] = useState<boolean | null>(null);\n  const [logoUrl, setLogoUrl] = useState<string | null>(null);"
  );
}

if (!content.includes('const { data: settingsData } = await supabase.from(\'settings\')')) {
  content = content.replace(
    "const { data, error } = await supabase.rpc('check_if_admin_exists');",
    "const { data: settingsData } = await supabase.from('settings').select('logo_url').eq('id', 'global').single();\n        if (settingsData?.logo_url) setLogoUrl(settingsData.logo_url);\n\n        const { data, error } = await supabase.rpc('check_if_admin_exists');"
  );
}

content = content.replace(
  /<img src="\/header-logo-dark\.png\?v=2\.0" alt="New Bharat Electricals" className="h-20 w-auto object-contain" \/>/g,
  `<img src={logoUrl || "/header-logo-dark.png"} alt="New Bharat Electricals" className="h-20 w-auto object-contain" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('images.unsplash.com')) target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; }} />`
);

fs.writeFileSync('src/pages/admin/AdminLogin.tsx', content);
