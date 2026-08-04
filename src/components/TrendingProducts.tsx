import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export default function TrendingProducts() {
  const { addToCart } = useCart();
  const { products, loading } = useStore();

  const trendingProducts = products.slice(0, 4);

  if (loading) return null;
  if (trendingProducts.length === 0) return null;

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10">
          <div>
            <h2 className="text-xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3 mb-2">
              Trending Products
            </h2>
            <p className="text-sm text-gray-700 font-medium pl-4">Discover what's popular among our customers</p>
          </div>
          <Link to="/power-solutions" className="hidden sm:inline-flex text-brand-green font-bold text-sm tracking-wide uppercase hover:underline">
            View All Trending
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5">
          {trendingProducts.map((product, idx) => {
            const regPrice = Number(product.regular_price) || 0;
            const salePrice = Number(product.sale_price) || 0;
            const discountPercent = (regPrice > salePrice && regPrice > 0)
              ? Math.round(((regPrice - salePrice) / regPrice) * 100)
              : 0;
            
            const categorySlug = product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'category';
            const subcategorySlug = product.slug || product.id;

            return (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden flex flex-col group transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-4 sm:p-6 relative bg-gradient-to-b from-gray-50 to-white">
                <Link to="/contact" className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-300 hover:text-brand-orange hover:scale-110 z-10 transition-all">
                  <Heart size={20} className="sm:w-6 sm:h-6" />
                </Link>
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-brand-orange text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm uppercase tracking-wider z-10">
                    {discountPercent}% OFF
                  </span>
                )}
                <Link to={`/${categorySlug}/${subcategorySlug}/${product.id}`} className="block h-36 sm:h-52 w-full flex items-center justify-center p-2">
                  <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
                </Link>
              </div>
              <div className="p-4 sm:p-6 pt-0 flex flex-col flex-grow">
                <div className="flex items-center justify-between mt-3 sm:mt-4 mb-3">
                  <div className="flex items-center text-[11px] sm:text-xs text-yellow-400">
                    <Star fill="currentColor" size={14} className="mr-0.5 sm:w-4 sm:h-4" />
                    <Star fill="currentColor" size={14} className="mr-0.5 sm:w-4 sm:h-4" />
                    <Star fill="currentColor" size={14} className="mr-0.5 sm:w-4 sm:h-4" />
                    <Star fill="currentColor" size={14} className="mr-0.5 sm:w-4 sm:h-4" />
                    <Star fill="currentColor" size={14} className="text-gray-200 mr-1" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-gray-900 font-medium bg-gray-100 px-2 py-1 rounded-md uppercase">{product.category || 'Product'}</span>
                </div>
                <Link to={`/${categorySlug}/${subcategorySlug}/${product.id}`}>
                  <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm text-gray-900 line-through mb-0.5 leading-none">₹{regPrice}</span>
                      <span className="text-lg sm:text-xl font-bold text-brand-dark leading-none">₹{salePrice || regPrice}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: (salePrice || regPrice).toString(),
                      imageUrl: product.image_url,
                      quantity: 1
                    })}
                    className="w-full bg-gray-900 hover:bg-brand-orange text-white transition-colors py-3 sm:py-3.5 rounded-xl font-bold tracking-wide text-xs sm:text-sm uppercase flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart size={16} className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          )})}
        </div>
        
        <div className="mt-6 text-center sm:hidden">
          <Link to="/power-solutions" className="inline-flex items-center text-brand-green font-bold text-sm tracking-wide uppercase hover:underline">
            View All Trending <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
