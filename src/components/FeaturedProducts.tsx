import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const { products, loading } = useStore();

  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  if (loading) return null;
  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-12 bg-[#f4f4f4] border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Featured Products
          </h2>
          <Link to="/power-solutions" className="text-brand-green font-bold text-sm tracking-wide uppercase hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {featuredProducts.map((product, idx) => {
            const discountPercent = product.regular_price > product.sale_price 
              ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
              : 0;
            
            // Format category name for url slug, using basic replace
            const categorySlug = product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'category';
            const subcategorySlug = product.slug || product.id;

            return (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col group transition-all"
            >
              <div className="p-2 sm:p-4 relative">
                <Link to="/contact" className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-brand-green hover:scale-110 z-10 bg-white p-1 sm:p-1.5 rounded-full shadow-sm transition-all">
                  <Heart size={16} className="sm:w-4 sm:h-4" />
                </Link>
                {discountPercent > 0 && (
                  <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-brand-green text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-wider z-10">
                    {discountPercent}% OFF
                  </span>
                )}
                <Link to={`/${categorySlug}/${subcategorySlug}/${product.id}`} className="block h-32 sm:h-48 w-full bg-white flex items-center justify-center p-1 sm:p-2">
                  <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
                </Link>
              </div>
              <div className="p-3 sm:p-4 pt-0 flex flex-col flex-grow border-t border-gray-50 mt-1 sm:mt-2">
                <div className="flex items-center text-[10px] sm:text-xs mt-2 sm:mt-3 mb-1.5 sm:mb-2 text-yellow-500">
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-3.5 sm:h-3.5" />
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-3.5 sm:h-3.5 hidden sm:block" />
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-3.5 sm:h-3.5 hidden sm:block" />
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-3.5 sm:h-3.5 hidden sm:block" />
                  <Star fill="currentColor" size={12} className="text-gray-300 mr-0.5 sm:mr-1 hidden sm:block" />
                </div>
                <Link to={`/${categorySlug}/${subcategorySlug}/${product.id}`}>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-snug mb-2 sm:mb-3 group-hover:text-brand-green transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto">
                  <div className="flex flex-col sm:flex-row sm:items-end mb-2 sm:mb-4">
                    <span className="text-sm sm:text-lg font-bold text-gray-900 mr-2">₹{product.sale_price}</span>
                    <span className="text-[10px] sm:text-sm text-gray-400 line-through mb-0.5">₹{product.regular_price}</span>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.sale_price.toString(),
                      imageUrl: product.image_url,
                      quantity: 1
                    })}
                    className="w-full bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/20 transition-colors py-1.5 sm:py-2 rounded-lg font-bold tracking-wide text-[10px] sm:text-xs uppercase flex items-center justify-center"
                  >
                    <ShoppingCart size={14} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
