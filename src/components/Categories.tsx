import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Power Solutions',
    slug: 'power-solutions',
    image: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=400&auto=format&fit=crop',
  },
  {
    title: 'Solar Solutions',
    slug: 'solar-solutions',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop',
  },
  {
    title: 'Mobility Solutions',
    slug: 'mobility-solutions',
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=400&auto=format&fit=crop',
  },
  {
    title: 'Electrical Accessories',
    slug: 'electrical-accessories',
    image: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=400&auto=format&fit=crop',
  }
];

export default function Categories() {
  return (
    <section id="solutions" className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/${cat.slug}`} className="flex flex-col items-center group">
                <div className="w-full aspect-square bg-brand-gray rounded-xl overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:border-brand-green group-hover:shadow-md transition-all duration-300 relative">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300"></div>
                </div>
                <h3 className="font-heading font-bold text-gray-800 text-center text-sm md:text-base group-hover:text-brand-green transition-colors">
                  {cat.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
