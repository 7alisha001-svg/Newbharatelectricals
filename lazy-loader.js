// simple script to transform App.tsx imports to lazy imports
const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const pages = [
  'GenericCategoryPage',
  'GenericSubCategoryPage',
  'ProductPage',
  'Catalogue',
  'StoreLocator',
  'Contact',
  'CartPage',
  'CheckoutPage',
  'OrderSuccessPage',
  'AboutUsPage',
  'PrivacyPolicyPage',
  'TermsConditionsPage',
  'BrandPage',
  'AdminLogin',
  'AdminLayout',
  'Dashboard',
  'Orders',
  'Products',
  'ProductForm',
  'Inventory',
  'Categories',
  'CategoryForm',
  'Brands',
  'BrandSliderAdmin',
  'BrandForm',
  'Customers',
  'Quotes',
  'Leads',
  'Settings',
  'Locations',
  'Navigation',
  'CategoryProductManager',
  'GoogleSheetsPage'
];

pages.forEach(page => {
  const importRegex = new RegExp(`import ${page} from '\\./pages/(.*?)';`, 'g');
  content = content.replace(importRegex, `const ${page} = React.lazy(() => import('./pages/$1'));`);
});

content = `import React, { Suspense } from 'react';\n` + content;

content = content.replace(
  '<Routes>', 
  '<Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div></div>}>\n          <Routes>'
);

content = content.replace(
  '</Routes>',
  '</Routes>\n          </Suspense>'
);

fs.writeFileSync('src/App.tsx', content);
