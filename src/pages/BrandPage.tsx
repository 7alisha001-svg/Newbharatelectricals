import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export default function BrandPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { brands, products, loading } = useStore();
  const { addToCart } = useCart();

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  const currentBrand = brands.find(b => b.slug?.toLowerCase() === brandSlug?.toLowerCase() || b.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') === brandSlug?.toLowerCase());
  
  if (!currentBrand) {
    return <div className="p-20 text-center">Brand not found</div>;
  }

  // Robustly filter products by brand name or slug
  const matchBrand = (prodBrand: string, brandName: string, brandSlug: string) => {
    if (!prodBrand) return false;
    const pb = prodBrand.toLowerCase().replace(/[^a-z0-9]/g, '');
    const bn = brandName ? brandName.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const bs = brandSlug ? brandSlug.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    if (bn && (pb === bn || pb.includes(bn) || bn.includes(pb))) return true;
    if (bs && (pb === bs || pb.includes(bs) || bs.includes(pb))) return true;
    return false;
  };

  const brandProducts = products.filter(p => matchBrand(p.brand, currentBrand.name, currentBrand.slug));

  const title = currentBrand.name;
  const bgImage = currentBrand.logo_url || 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop';

  return (
    <>
      <Helmet>
        <title>{`${title} Products (${brandProducts.length} Products) | New Bharat Electricals`}</title>
        <meta name="description" content={`Explore all ${title} products available at New Bharat Electricals.`} />
      </Helmet>

      <div className="w-full bg-white pb-20">
        
        {/* Breadcrumb Header */}
        <div className="bg-brand-gray/50 py-4 border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="flex items-center text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
              <Link to="/" className="text-gray-400 hover:text-brand-green flex items-center"><Home size={14} className="mr-1" /> Home</Link>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <Link to="/brands" className="text-gray-400 hover:text-brand-green">Brands</Link>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <span className="text-brand-green font-bold">{title}</span>
            </div>
          </div>
        </div>

        {/* Brand Hero */}
      <section className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center overflow-hidden bg-white border-b border-gray-100 mb-12">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
           {currentBrand.logo_url && (
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={currentBrand.logo_url} 
              alt={title}
              className="h-24 md:h-32 object-contain mb-6 drop-shadow-md"
            />
           )}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-heading font-bold mb-2 text-gray-900"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl"
          >
            Explore our premium range of {title} products.
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            {title} Products <span className="text-sm font-normal text-gray-500 ml-2">({brandProducts.length} Products)</span>
          </h2>
        </div>

        {brandProducts.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Available</h3>
            <p className="text-gray-500 max-w-md">We are currently updating our catalogue for {title}. Please check back later or explore our other premium brands.</p>
            <Link to="/catalogue" className="mt-6 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {brandProducts.map((product, idx) => {
              const discountPercent = product.regular_price > product.sale_price 
                ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                : 0;
              const catSlug = product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'category';

              return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300"
              >
                <div className="p-3 sm:p-5 relative bg-white h-40 sm:h-56 flex items-center justify-center">
                   {discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-brand-orange text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
                      {discountPercent}% OFF
                    </span>
                  )}
                  <Link to={`/${catSlug}/all/${product.id}`} className="block w-full h-full p-2">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} 
                    />
                  </Link>
                </div>
                
                <div className="p-4 sm:p-5 flex flex-col flex-grow border-t border-gray-50">
                   <div className="flex items-center text-[10px] sm:text-xs text-yellow-400 mb-2">
                      <Star fill="currentColor" size={12} className="mr-0.5" />
                      <Star fill="currentColor" size={12} className="mr-0.5" />
                      <Star fill="currentColor" size={12} className="mr-0.5" />
                      <Star fill="currentColor" size={12} className="mr-0.5" />
                      <Star fill="currentColor" size={12} className="text-gray-200" />
                    </div>
                  <Link to={`/${catSlug}/all/${product.id}`}>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-snug mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.short_description || product.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end mb-3 sm:mb-4">
                      <span className="text-base sm:text-lg font-bold text-gray-900 mr-2">₹{product.sale_price}</span>
                      <span className="text-xs sm:text-sm text-gray-400 line-through">₹{product.regular_price}</span>
                    </div>
                    <button 
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.sale_price.toString(),
                        imageUrl: product.image_url,
                        quantity: 1
                      })}
                      className="w-full bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/20 transition-colors py-2 rounded-lg font-bold tracking-wide text-xs uppercase flex items-center justify-center"
                    >
                      <ShoppingCart size={14} className="mr-2" /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
              )
            })}
          </div>
        )}
      </section>
    </div>
    </>
  );
}
