import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const featuredProducts = [
  {
    id: 'ami-3100',
    category: 'solar-solutions',
    subcategory: 'solar-inverters',
    name: 'AMI 3100 Solar Inverter',
    originalPrice: '10,50,000',
    price: '9,37,000',
    discount: '11% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'nxt-plus-2kVA',
    category: 'power-solutions',
    subcategory: 'home-inverters',
    name: 'Luminous Zelio+ Home Pure Sine Wave',
    originalPrice: '7,500',
    price: '6,250',
    discount: '16% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=400&auto=format&fit=crop',
    rating: 4.5,
    reviews: 89
  },
  {
    id: 'inver-battery-200ah',
    category: 'power-solutions',
    subcategory: 'battery-backup-systems',
    name: 'Exide Invatubular 150Ah Tall Tubular',
    originalPrice: '18,000',
    price: '15,500',
    discount: '14% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=400&auto=format&fit=crop',
    rating: 4.9,
    reviews: 210
  },
  {
    id: 'solar-panel-330w',
    category: 'solar-solutions',
    subcategory: 'residential-solar-panels',
    name: 'Loom Solar Panel 330 Watt Mono Perc',
    originalPrice: '15,000',
    price: '12,500',
    discount: '16% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop',
    rating: 4.7,
    reviews: 56
  }
];

export default function FeaturedProducts() {
  const { addToCart } = useCart();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col group transition-all"
            >
              <div className="p-4 relative">
                <Link to="/contact" className="absolute top-4 right-4 text-gray-400 hover:text-brand-green hover:scale-110 z-10 bg-white p-1.5 rounded-full shadow-sm transition-all">
                  <Heart size={18} />
                </Link>
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-brand-green text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
                    {product.discount}
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
