const fs = require('fs');

let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace import { mainNavLinks } with useStore
code = code.replace(
  "import { mainNavLinks } from '../data/navigation';",
  `import { useStore } from '../context/StoreContext';`
);

// We'll replace the hardcoded navLinks inside the component with a dynamically computed one.
// Let's find: `const [mobileMenuOpen, setMobileMenuOpen] = useState(false);`
code = code.replace(
  "const [mobileMenuOpen, setMobileMenuOpen] = useState(false);",
  `const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { categories, brands } = useStore();
  
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
  ];`
);

// Now remove the line `const navLinks = mainNavLinks;` if it exists (but wait, it might be outside the component)
code = code.replace("const navLinks = mainNavLinks;", "");

fs.writeFileSync('src/components/Navbar.tsx', code);
