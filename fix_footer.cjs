const fs = require('fs');

let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

code = code.replace(
  "import { useStore } from '../context/StoreContext';",
  "import { useStore } from '../context/StoreContext';\nimport { mainNavLinks as fallbackNavLinks } from '../data/navigation';"
);

const replaceFind = `  const { categories, brands } = useStore();
  
  const mainNavLinks = [
    { name: 'Home', href: '/' },
    { 
      name: 'Categories', 
      href: '/categories',
      hasDropdown: true,
      dropdownItems: categories.map(cat => ({ name: cat.name, href: \`/\${cat.slug}\` }))
    },
    { 
      name: 'Brands', 
      href: '/brands',
      hasDropdown: true,
      dropdownItems: brands.map(brand => ({ name: brand.name, href: \`/brands/\${brand.slug}\` }))
    },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact' }
  ];`;

const replaceWith = `  const { settings } = useStore();
  const mainNavLinks = settings?.social_links?.navigation || fallbackNavLinks;`;

code = code.replace(replaceFind, replaceWith);

fs.writeFileSync('src/components/Footer.tsx', code);
