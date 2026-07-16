import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';

export default function BrandsSection() {
  const { brands, settings, loading } = useStore();

  if (loading) return null;

  const sliderData = settings?.social_links?.brand_slider;
  let items = [];

  if (sliderData?.items && sliderData.items.length > 0) {
    items = sliderData.items
      .filter((item: any) => item.is_enabled)
      .sort((a: any, b: any) => a.order - b.order);
  } else {
    // Fallback to old featured brands logic
    const featuredBrandSlugs = settings?.social_links?.featured_brands || [];
    const featuredBrands = brands
      .filter(brand => featuredBrandSlugs.includes(brand.slug))
      .slice(0, 10);
      
    items = featuredBrands.map((b, idx) => ({
      id: b.id,
      name: b.name,
      logo_url: b.logo_url,
      link: `/brands/${b.slug || b.name?.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      is_enabled: true,
      order: idx
    }));
  }

  if (items.length === 0) return null;

  // We need enough items to fill the screen twice to ensure a seamless infinite loop.
  // Assuming each item is ~200px wide, a 1920px screen holds ~10 items.
  // So a base set of at least 12 items is safe.
  const MIN_ITEMS = 12;
  const loopMultiplier = Math.ceil(MIN_ITEMS / items.length);
  const repeatedItems = Array(loopMultiplier).fill(items).flat();
  
  // For the continuous marquee, duplicate the fully populated set exactly once.
  // We will animate the parent container from x: "0%" to x: "-50%".
  const sliderItems = [...repeatedItems, ...repeatedItems];

  // Calculate duration based on the number of unique items in one half, 
  // so the scrolling speed remains visually consistent regardless of item count.
  const baseSpeedPerItem = 3; // seconds per item
  const animationDuration = repeatedItems.length * baseSpeedPerItem;

  return (
    <section id="brands" className="py-8 md:py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <h2 className="text-xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Shop by Brands
          </h2>
        </div>

        <div className="w-full relative overflow-hidden group">
          {/* Fading edges for a premium look (optional but recommended for a premium slider) */}
          <div className="absolute top-0 left-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: animationDuration
            }}
            className="flex w-max"
          >
            {sliderItems.map((brand: any, index: number) => (
              <div 
                key={`${brand.id}-${index}`} 
                className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[230px] px-2 md:px-3 lg:px-4 flex h-auto"
              >
                <Link to={brand.link || '#'} className="flex flex-col items-center group w-full h-full">
                  <div className="w-full aspect-[4/3] bg-white rounded-xl overflow-hidden mb-3 border border-gray-200 shadow-sm group-hover:border-brand-green group-hover:shadow-md transition-all duration-300 relative flex items-center justify-center p-4 md:p-6">
                    {brand.logo_url ? (
                      <img 
                        src={brand.logo_url} 
                        alt={brand.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { 
                          const target = e.currentTarget; 
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-800 font-heading font-bold text-xl md:text-2xl uppercase tracking-wider"
                      style={{ display: brand.logo_url ? 'none' : 'flex' }}
                    >
                      {brand.name ? brand.name.substring(0, 2) : 'B'}
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-gray-800 text-center text-sm md:text-base group-hover:text-brand-green transition-colors mt-auto">
                    {brand.name}
                  </h3>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
