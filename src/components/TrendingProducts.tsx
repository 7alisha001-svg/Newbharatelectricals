import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const trendingProducts = [
  {
    id: 'e-rickshaw-battery-100ah',
    category: 'mobility-solutions',
    subcategory: 'e-rickshaw-batteries',
    name: 'New Bharat E-Rickshaw Battery 100Ah',
    originalPrice: '12,000',
    price: '9,800',
    discount: '18% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=400&auto=format&fit=crop',
    rating: 4.6,
    reviews: 156
  },
  {
    id: 'solar-pcu-5kva',
    category: 'solar-solutions',
    subcategory: 'solar-inverters',
    name: 'Smart Solar PCU 5kVA MPPT',
    originalPrice: '45,000',
    price: '38,500',
    discount: '14% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop',
    rating: 4.9,
    reviews: 78
  },
  {
    id: 'heavy-duty-inverter-2-5kva',
    category: 'power-solutions',
    subcategory: 'industrial-inverters',
    name: 'Heavy Duty Industrial Inverter 2.5kVA',
    originalPrice: '25,000',
    price: '21,000',
    discount: '16% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=400&auto=format&fit=crop',
    rating: 4.7,
    reviews: 92
  },
  {
    id: 'ev-charger-wallbox',
    category: 'mobility-solutions',
    subcategory: 'charging-support',
    name: 'Fast EV Charger Wallbox 7.2kW',
    originalPrice: '35,000',
    price: '29,999',
    discount: '14% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=400&auto=format&fit=crop',
    rating: 4.8,
    reviews: 45
  },
  {
    id: 'tubular-battery-220ah',
    category: 'power-solutions',
    subcategory: 'battery-backup-systems',
    name: 'Jumbo Tubular Battery 220Ah capacity',
    originalPrice: '22,000',
    price: '18,500',
    discount: '15% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop',
    rating: 4.9,
    reviews: 134
  }
];

export default function TrendingProducts() {
  const { addToCart } = useCart();

  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Trending Products
          </h2>
          <div className="flex items-center space-x-2">
            {/* Carousel navigation placeholders */}
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-green hover:border-brand-green cursor-pointer transition-colors">
              &larr;
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-green hover:border-brand-green cursor-pointer transition-colors">
              &rarr;
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-4 md:gap-6 hide-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {trendingProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col group transition-all min-w-[260px] md:min-w-[280px]"
            >
              <div className="p-4 relative">
                <Link to="/contact" className="absolute top-4 right-4 text-gray-400 hover:text-brand-green hover:scale-110 z-10 bg-white p-1.5 rounded-full shadow-sm transition-all">
                  <Heart size={18} />
                </Link>
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
                    Trending
                  </span>
                )}
                <Link to={`/${product.category}/${product.subcategory}/${product.id}`} className="block h-48 w-full bg-white flex items-center justify-center p-2">
                  <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </Link>
              </div>
              <div className="p-4 pt-0 flex flex-col flex-grow border-t border-gray-50 mt-2">
                <div className="flex items-center text-xs mt-3 mb-2 text-yellow-500">
                  <Star fill="currentColor" size={14} className="mr-0.5" />
                  <Star fill="currentColor" size={14} className="mr-0.5" />
                  <Star fill="currentColor" size={14} className="mr-0.5" />
                  <Star fill="currentColor" size={14} className="mr-0.5" />
                  <Star fill="currentColor" size={14} className="text-gray-300 mr-1" />
                  <span className="text-gray-400">({product.reviews})</span>
                </div>
                <Link to={`/${product.category}/${product.subcategory}/${product.id}`}>
                  <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3 group-hover:text-brand-green transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto">
                  <div className="flex items-end mb-4">
                    <span className="text-lg font-bold text-gray-900 mr-2">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through mb-0.5">₹{product.originalPrice}</span>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      imageUrl: product.imageUrl,
                      quantity: 1
                    })}
                    className="w-full bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white border border-brand-green/20 transition-colors py-2 rounded-lg font-bold tracking-wide text-xs uppercase flex items-center justify-center"
                  >
                    <ShoppingCart size={14} className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
