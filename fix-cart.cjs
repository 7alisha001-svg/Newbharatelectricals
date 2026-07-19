const fs = require('fs');
let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

content = content.replace(
  "return saved ? JSON.parse(saved) : [];",
  `try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }`
);

fs.writeFileSync('src/context/CartContext.tsx', content);
