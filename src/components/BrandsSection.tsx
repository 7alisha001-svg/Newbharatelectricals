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
    <section id="brands" className="py-8 md:py-12 bg-white border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Shop by Brand
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4 md:gap-6 w-full">
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
                  {brand.logo_url ? (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { 
                        const target = e.currentTarget; 
                        // Fallback to text if image fails to load
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-800 font-heading font-bold text-2xl uppercase tracking-wider"
                    style={{ display: brand.logo_url ? 'none' : 'flex' }}
                  >
                    {brand.name ? brand.name.substring(0, 2) : 'B'}
                  </div>
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
