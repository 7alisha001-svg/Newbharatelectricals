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
    <section className="py-8 md:py-16 lg:py-20 bg-[#f4f4f4] border-none">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <h2 className="text-lg md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Featured Products
          </h2>
          <Link to="/power-solutions" className="text-brand-green font-bold text-xs md:text-sm tracking-wide uppercase hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4">
          {featuredProducts.map((product, idx) => {
            const regPrice = Number(product.regular_price) || 0;
            const salePrice = Number(product.sale_price) || 0;
            const discountPercent = (regPrice > salePrice && regPrice > 0)
              ? Math.round(((regPrice - salePrice) / regPrice) * 100)
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
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-2 sm:p-5 relative bg-gradient-to-b from-gray-50 to-white">
                <Link to="/contact" className="absolute top-2 right-2 sm:top-5 sm:right-5 text-gray-400 hover:text-brand-orange hover:scale-110 z-10 bg-white p-1 sm:p-2 rounded-full shadow-sm transition-all">
                  <Heart size={14} className="sm:w-5 sm:h-5" />
                </Link>
                {discountPercent > 0 && (
                  <span className="absolute top-2 left-2 sm:top-5 sm:left-5 bg-brand-orange text-white text-[8px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1.5 rounded-lg shadow-sm uppercase tracking-wider z-10">
                    {discountPercent}% OFF
                  </span>
                )}
                <Link to={`/${categorySlug}/${subcategorySlug}/${product.id}`} className="block h-28 sm:h-48 w-full flex items-center justify-center p-1 sm:p-2">
                  <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
                </Link>
              </div>
              <div className="p-3 sm:p-6 pt-0 flex flex-col flex-grow">
                <div className="flex items-center text-[10px] sm:text-xs mt-2 sm:mt-4 mb-1.5 sm:mb-3 text-yellow-400">
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-4 sm:h-4" />
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-4 sm:h-4" />
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-4 sm:h-4" />
                  <Star fill="currentColor" size={12} className="mr-0.5 sm:w-4 sm:h-4" />
                  <Star fill="currentColor" size={12} className="text-gray-200 mr-0.5 sm:mr-1" />
                </div>
                <Link to={`/${categorySlug}/${subcategorySlug}/${product.id}`}>
                  <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-snug mb-2 sm:mb-4 group-hover:text-brand-orange transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex flex-row items-center justify-between gap-2 mb-3 sm:mb-5">
                    <span className="text-[10px] sm:text-sm text-gray-900 line-through">₹{regPrice}</span>
                    <span className="text-base sm:text-xl font-bold text-gray-900">₹{salePrice || regPrice}</span>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: (salePrice || regPrice).toString(),
                      imageUrl: product.image_url,
                      quantity: 1
                    })}
                    className="w-full bg-brand-green hover:bg-brand-orange text-white border-none transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg py-2.5 sm:py-3.5 rounded-xl font-bold tracking-wide text-[10px] sm:text-sm uppercase flex items-center justify-center shadow-sm hover:shadow-md"
                  >
                    <ShoppingCart size={14} className="mr-1 sm:mr-2" /> Add to Cart
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
