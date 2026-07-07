const fs = require('fs');

let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  "import { useCart } from '../context/CartContext';",
  "import { useCart } from '../context/CartContext';\nimport { mainNavLinks } from '../data/navigation';"
);

const replaceFind = `  const { categories, brands } = useStore();
  
  const navLinks = [
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
  const navLinks = settings?.social_links?.navigation || mainNavLinks;`;

code = code.replace(replaceFind, replaceWith);

fs.writeFileSync('src/components/Navbar.tsx', code);
