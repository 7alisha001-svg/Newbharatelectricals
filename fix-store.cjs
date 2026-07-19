const fs = require('fs');

let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

content = content.replace(
  'import React, { createContext, useContext, useEffect, useState } from \'react\';',
  'import React, { createContext, useContext, useEffect, useState, useRef } from \'react\';'
);

content = content.replace(
  '  let fetchTimeout: any;',
  '  const fetchTimeout = useRef<NodeJS.Timeout | null>(null);'
);

content = content.replace(
  /    if \(fetchTimeout\) clearTimeout\(fetchTimeout\);\n    fetchTimeout = setTimeout\(fetchData, 1000\);/g,
  `    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    fetchTimeout.current = setTimeout(fetchData, 1000);`
);

fs.writeFileSync('src/context/StoreContext.tsx', content);
