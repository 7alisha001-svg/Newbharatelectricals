const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import Settings from './pages/admin/Settings';",
  "import Settings from './pages/admin/Settings';\nimport Navigation from './pages/admin/Navigation';"
);

code = code.replace(
  "<Route path=\"customers\" element={<Customers />} />\n              <Route path=\"settings\" element={<Settings />} />",
  "<Route path=\"customers\" element={<Customers />} />\n              <Route path=\"navigation\" element={<Navigation />} />\n              <Route path=\"settings\" element={<Settings />} />"
);

fs.writeFileSync('src/App.tsx', code);
