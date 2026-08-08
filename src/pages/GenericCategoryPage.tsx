import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Home, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export default function GenericCategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { categories, products, loading } = useStore();
  const { addToCart } = useCart();

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  let currentCategory = categories.find(c => c.slug === categorySlug);
  
  if (!currentCategory) {
    if (categorySlug === 'power-solutions') {
      currentCategory = {
        id: 'power-solutions',
        name: 'Power Solutions',
        slug: 'power-solutions',
        description: 'High-performance inverters, tall tubular batteries, and integrated combo power backups.',
        image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2500&auto=format&fit=crop'
      };
    } else if (categorySlug === 'solar-solutions') {
      currentCategory = {
        id: 'solar-solutions',
        name: 'Solar Solutions',
        slug: 'solar-solutions',
        description: 'Complete range of solar on-grid, off-grid and hybrid PCUs, advanced solar panels, and solar charge controllers.',
        image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop'
      };
    }
  }
  
  if (!currentCategory) {
    return <div className="p-20 text-center">Category not found</div>;
  }

  const isProductInParentCategory = (productCat: string, parentSlug: string) => {
    if (!productCat || !parentSlug) return false;
    const pCat = productCat.toLowerCase().trim();
    const pSlug = parentSlug.toLowerCase().trim();

    if (pSlug === 'power-solutions') {
      const powerSubcats = ['inverter', 'batter', '3-phase', 'lift', 'combo'];
      return powerSubcats.some(sub => pCat.includes(sub));
    }
    if (pSlug === 'solar-solutions') {
      const solarSubcats = ['solar'];
      return solarSubcats.some(sub => pCat.includes(sub));
    }
    return pCat === pSlug;
  };

  // Filter products by category name or matching subcategory
  const categoryProducts = products.filter(p => 
    p.category === currentCategory.name || 
    isProductInParentCategory(p.category || '', categorySlug || '')
  );

  const title = currentCategory.name;
  const bgImage = currentCategory.image_url || 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2500&auto=format&fit=crop';

  return (
    <>
      <Helmet>
        <title>{`${title} | New Bharat Electricals`}</title>
        <meta name="description" content={`Explore our premium range of ${title.toLowerCase()} configured for efficiency, reliability, and maximum performance by New Bharat Electricals.`} />
      </Helmet>

      <div className="w-full bg-white pb-12 md:pb-20">
        
        {/* Breadcrumb Header */}
        <div className="bg-brand-gray/50 py-3 md:py-4 border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="flex items-center text-sm font-medium text-gray-700 font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
              <Link to="/" className="text-gray-900 hover:text-brand-green flex items-center"><Home size={14} className="mr-1" /> Home</Link>
              <ChevronRight size={14} className="mx-2 text-gray-900 flex-shrink-0" />
              <span className="text-brand-green font-bold">{title}</span>
            </div>
          </div>
        </div>

        {/* Category Hero */}
      <section className="relative w-full h-[180px] md:h-[300px] flex items-center justify-center overflow-hidden bg-brand-dark mb-8 md:mb-12">
        <motion.div 
          initial={{ scale: 1.02 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0 bg-cover bg-center origin-center"
          style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 40%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-transparent"></div>
        </motion.div>
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-5xl font-heading font-bold mb-1.5 md:mb-2 text-white"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm md:text-lg text-gray-300 max-w-2xl"
          >
            {currentCategory.description || `Explore our premium range of ${title.toLowerCase()} configured for efficiency, reliability, and maximum performance.`}
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2 className="text-lg md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Products
          </h2>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-gray-700 font-medium py-8">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-6">
            {categoryProducts.map((product, idx) => {
              const regPrice = Number(product.regular_price) || 0;
              const salePrice = Number(product.sale_price) || 0;
              const discountPercent = (regPrice > salePrice && regPrice > 0)
                ? Math.round(((regPrice - salePrice) / regPrice) * 100)
                : 0;

              return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl md:rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300"
              >
                <div className="p-2 sm:p-6 relative bg-white h-32 sm:h-56 flex items-center justify-center">
                   {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-brand-orange text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded uppercase tracking-wider z-10">
                      {discountPercent}% OFF
                    </span>
                  )}
                  <Link to={`/${currentCategory.slug}/all/${product.id}`} className="block w-full h-full p-1 sm:p-2">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} 
                    />
                  </Link>
                </div>
                
                <div className="p-3 sm:p-6 flex flex-col flex-grow border-t border-gray-50">
                   <div className="flex items-center text-[10px] sm:text-xs text-yellow-400 mb-2">
                      <Star fill="currentColor" size={11} className="mr-0.5" />
                      <Star fill="currentColor" size={11} className="mr-0.5" />
                      <Star fill="currentColor" size={11} className="mr-0.5" />
                      <Star fill="currentColor" size={11} className="mr-0.5" />
                      <Star fill="currentColor" size={11} className="text-gray-200" />
                    </div>
                  <Link to={`/${currentCategory.slug}/all/${product.id}`}>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-1.5 sm:mb-2 group-hover:text-brand-green transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-3 text-[11px] sm:text-xs">{product.short_description || product.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end mb-2 sm:mb-4">
                      <span className="text-sm sm:text-lg font-bold text-gray-900 mr-2">₹{salePrice || regPrice}</span>
                      {regPrice > salePrice && <span className="text-[10px] sm:text-sm text-gray-900 line-through">₹{regPrice}</span>}
                    </div>
                    <button 
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: (salePrice || regPrice).toString(),
                        imageUrl: product.image_url,
                        quantity: 1
                      })}
                      className="w-full bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/20 transition-colors py-2.5 sm:py-2 rounded-xl sm:rounded-2xl font-bold tracking-wide text-[10px] sm:text-xs uppercase flex items-center justify-center"
                    >
                      <ShoppingCart size={12} className="mr-1.5 sm:mr-2" /> Add to Cart
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
