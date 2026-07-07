const fs = require('fs');

let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Replace import { mainNavLinks } with useStore
code = code.replace(
  "import { mainNavLinks } from '../data/navigation';",
  `import { useStore } from '../context/StoreContext';`
);

// We'll replace the hardcoded navLinks inside the component with a dynamically computed one.
code = code.replace(
  "export default function Footer() {",
  `export default function Footer() {
  const { categories, brands } = useStore();
  
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
  ];`
);

fs.writeFileSync('src/components/Footer.tsx', code);
