import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function BrandsSection() {
  const { brands, settings, loading } = useStore();

  if (loading) return null;

  // Retrieve featured brands from settings
  const featuredBrandSlugs = settings?.social_links?.featured_brands || [];
  
  // Filter brands based on the featured slugs and limit to 5
  const featuredBrands = brands
    .filter(brand => featuredBrandSlugs.includes(brand.slug))
    .slice(0, 5);

  if (featuredBrands.length === 0) return null; // Don't show the section if no featured brands

  return (
    <section id="brands" className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Shop by Brand
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full">
          {featuredBrands.map((brand, idx) => (
            <motion.div 
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="w-full flex"
            >
              <Link to={`/brands/${brand.slug || brand.name?.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="flex flex-col items-center group w-full">
                <div className="w-full aspect-[4/3] bg-white rounded-xl overflow-hidden mb-3 border border-gray-200 shadow-sm group-hover:border-brand-green group-hover:shadow-md transition-all duration-300 relative flex items-center justify-center p-6">
                  <img 
                    src={brand.logo_url || 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=400&auto=format&fit=crop'} 
                    alt={brand.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }}
                  />
                </div>
                <h3 className="font-heading font-bold text-gray-800 text-center text-sm md:text-base group-hover:text-brand-green transition-colors mt-auto">
                  {brand.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
