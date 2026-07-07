const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');

// Replace the mock product finding with store context
code = code.replace(
  "import { useCart } from '../context/CartContext';",
  `import { useCart } from '../context/CartContext';\nimport { useStore } from '../context/StoreContext';`
);

// find the function body start
code = code.replace(
  "export default function ProductPage() {",
  `export default function ProductPage() {\n  const { products, loading } = useStore();`
);

// replace the dummy product definition with finding from store
const dummyProductStr = `  // This is placeholder structural data.
  // It will be replaced naturally when real data is integrated into a unified data structure.
  const product = {
    id: productId || 'an-star-11075',
    name: 'AN STAR 11075',
    sku: \`NBE-\${productId?.substring(0, 4).toUpperCase() || 'ANS1'}\`,
    stockStatus: 'In Stock',
    description: 'The AN STAR 11075 is a high-performance 10 KVA Pure Sine Wave Digital Inverter designed to deliver reliable, uninterrupted power for homes, offices, commercial establishments, and industrial applications. Built with advanced digital technology, it features an intelligent LCD display that provides real-time information about battery status, backup time, charging performance, and load percentage.',
    features: [
      '10 KVA / 120V High-Capacity Power Backup',
      'Pure Sine Wave Output for Sensitive Electronics',
      'Intelligent LCD Display for Real-time Monitoring',
      'Advanced DSP (Digital Signal Processing) Technology',
      'Supports Heavy Loads including Air Conditioners & Machinery',
      'Comprehensive Protection (Overload, Short Circuit, Battery Deep Discharge)'
    ],
    originalPrice: '10,50,000',
    price: '9,37,000',
    discount: '11% OFF',
    rating: 4.8,
    reviews: 124,
    images: [
      '/images/amaze-an-star-1475-1.jpg',
      '/images/4-500x500.jpg'
    ]
  };`;

const newProductFind = `
  if (loading) return <div className="p-20 text-center">Loading product...</div>;
  
  const rawProduct = products.find(p => p.id === productId);
  if (!rawProduct) {
    return <div className="p-20 text-center">Product not found</div>;
  }

  const discountPercent = rawProduct.regular_price > rawProduct.sale_price 
    ? Math.round(((rawProduct.regular_price - rawProduct.sale_price) / rawProduct.regular_price) * 100)
    : 0;

  const product = {
    id: rawProduct.id,
    name: rawProduct.name,
    sku: rawProduct.sku,
    stockStatus: rawProduct.stock_status === 'instock' ? 'In Stock' : 'Out of Stock',
    description: rawProduct.description,
    features: rawProduct.features || [],
    originalPrice: rawProduct.regular_price.toString(),
    price: rawProduct.sale_price.toString(),
    discount: discountPercent > 0 ? \`\${discountPercent}% OFF\` : '',
    rating: 4.8,
    reviews: 124,
    images: rawProduct.gallery_images?.length > 0 ? rawProduct.gallery_images : [rawProduct.image_url],
    specs: rawProduct.specs || []
  };
`;

code = code.replace(dummyProductStr, newProductFind);
fs.writeFileSync('src/pages/ProductPage.tsx', code);
