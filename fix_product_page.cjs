const fs = require('fs');

let code = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');

// The file looks like:
// export default function ProductPage() {
//   const { products, loading } = useStore();
//   const { category, subcategory, productId } = useParams<{ category: string, subcategory: string, productId: string }>();
// ...
//   const product = { ... };
// ...
//   return ( ... )

// Let's replace the whole chunk from `const product = {` down to `];` (the end of specifications)

const targetMatch = code.match(/const product = \{[\s\S]*?specifications: \[[\s\S]*?\]\n  \};/);
if (targetMatch) {
  const newProductFind = `
  if (loading) return <div className="p-20 text-center flex justify-center items-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div></div>;
  
  const rawProduct = products.find(p => p.id === productId);
  if (!rawProduct) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-brand-green text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-green-dark transition-colors">Return Home</Link>
      </div>
    );
  }

  const discountPercent = rawProduct.regular_price > rawProduct.sale_price 
    ? Math.round(((rawProduct.regular_price - rawProduct.sale_price) / rawProduct.regular_price) * 100)
    : 0;

  const product = {
    id: rawProduct.id,
    name: rawProduct.name,
    sku: rawProduct.sku || \`NBE-\${rawProduct.id.substring(0, 6).toUpperCase()}\`,
    stockStatus: rawProduct.stock_quantity > 0 ? 'In Stock' : 'Out of Stock',
    description: rawProduct.description,
    features: rawProduct.features || [],
    originalPrice: rawProduct.regular_price.toLocaleString('en-IN'),
    price: rawProduct.sale_price.toLocaleString('en-IN'),
    rawPrice: rawProduct.sale_price.toString(),
    discount: discountPercent > 0 ? \`\${discountPercent}% OFF\` : null,
    rating: 4.8,
    reviews: 124,
    images: rawProduct.gallery_images?.length > 0 ? rawProduct.gallery_images : (rawProduct.image_url ? [rawProduct.image_url] : []),
    specifications: rawProduct.specs || []
  };
`;
  code = code.replace(targetMatch[0], newProductFind);
  fs.writeFileSync('src/pages/ProductPage.tsx', code);
  console.log("Successfully replaced product definition.");
} else {
  console.log("Could not find product definition.");
}
