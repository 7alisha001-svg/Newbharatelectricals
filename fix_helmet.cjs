const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove Helmet from App
content = content.replace(
  /<Helmet>[\s\S]*?<\/Helmet>/,
  ""
);

content = content.replace(
  "const { settings } = useStore();",
  ""
);

// Add GlobalHead
const globalHead = `
const GlobalHead = () => {
  const { settings } = useStore();
  return (
      <Helmet>
        <title>{settings?.business_name || 'New Bharat Electricals'} | Trusted Solar & Electrical Solutions</title>
        {settings?.logo_url && <link rel="icon" type="image/png" href={settings.logo_url} />}
        <meta name="description" content="New Bharat Electricals provides high-quality solar solutions, inverters, batteries, and home electrical products. Powering every home and business with durable and efficient electrical systems." />
        <meta name="keywords" content="solar panels, inverters, batteries, electrical accessories, new bharat electricals, Buduan" />
      </Helmet>
  );
};
`;

content = content.replace(
  "const PublicLayout",
  globalHead + "\nconst PublicLayout"
);

content = content.replace(
  "<StoreProvider>",
  "<StoreProvider>\n        <GlobalHead />"
);

fs.writeFileSync('src/App.tsx', content);
