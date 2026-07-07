const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

code = code.replace(
  "  settings: Settings | null;\n}",
  "  settings: Settings | null;\n  refreshStore: () => Promise<void>;\n}"
);

code = code.replace(
  "  loading: true,\n  settings: null,\n});",
  "  loading: true,\n  settings: null,\n  refreshStore: async () => {},\n});"
);

code = code.replace(
  "  return (\n    <StoreContext.Provider value={{ categories, brands, products, loading, settings }}>",
  "  return (\n    <StoreContext.Provider value={{ categories, brands, products, loading, settings, refreshStore: fetchData }}>"
);

fs.writeFileSync('src/context/StoreContext.tsx', code);
