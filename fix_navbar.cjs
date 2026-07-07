const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  "import { mainNavLinks as navLinks } from '../data/navigation';",
  `import { useStore } from '../context/StoreContext';`
);

fs.writeFileSync('src/components/Navbar.tsx', code);
