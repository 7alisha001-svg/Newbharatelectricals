import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useMedia } from '../context/MediaContext';
import { motion, useMotionValue, animate } from 'motion/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BrandsSection() {
  const { brands } = useStore();
  const { getMediaUrl } = useMedia();
  const [cardWidth, setCardWidth] = useState(200);
  const cardWidthRef = useRef(cardWidth);
  const x = useMotionValue(0);
  const autoAnimationRef = useRef<{ cancel: boolean } | null>(null);
  const isManualNavRef = useRef(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const itemsCountRef = useRef(0);

  const defaultBrands = [
    {
      id: 'brand-amaze',
      name: 'AMAZE',
      slug: 'amaze',
      logo_url: getMediaUrl('brand_logo_amaze', 'https://ftxyuhwejcqxoyhmkczl.supabase.co/storage/v1/object/public/logos/amaze.png'),
      link: '/brands/amaze'
    },
    {
      id: 'brand-okaya',
      name: 'OKAYA',
      slug: 'okaya',
      logo_url: getMediaUrl('brand_logo_okaya', 'https://okayapower.com/assets/images/logo.png'),
      link: '/brands/okaya'
    },
    {
      id: 'brand-livguard',
      name: 'LIVGUARD',
      slug: 'livguard',
      logo_url: getMediaUrl('brand_logo_livguard', 'https://www.livguard.com/wp-content/themes/livguard/images/logo.png'),
      link: '/brands/livguard'
    },
    {
      id: 'brand-smarten',
      name: 'SMARTEN',
      slug: 'smarten',
      logo_url: getMediaUrl('brand_logo_smarten', 'https://smarten.in/assets/images/logo.png'),
      link: '/brands/smarten'
    },
    {
      id: 'brand-indpower',
      name: 'INDPOWER',
      slug: 'indpower',
      logo_url: getMediaUrl('brand_logo_indpower', ''),
      link: '/brands/indpower'
    },
    {
      id: 'brand-servokon',
      name: 'SERVOKON',
      slug: 'servokon',
      logo_url: getMediaUrl('brand_logo_servokon', 'https://www.servokon.com/images/logo.png'),
      link: '/brands/servokon'
    },
    {
      id: 'brand-addo',
      name: 'ADDO by Eastman',
      slug: 'addo-by-eastman',
      logo_url: getMediaUrl('brand_logo_addo', 'https://addobatteries.com/wp-content/uploads/2021/04/logo.png'),
      link: '/brands/addo-by-eastman'
    },
    {
      id: 'brand-massimo',
      name: 'MASSIMO',
      slug: 'massimo',
      logo_url: getMediaUrl('brand_logo_massimo', 'https://www.massimobatteries.com/wp-content/uploads/2022/07/massimo-logo.png'),
      link: '/brands/massimo'
    },
    {
      id: 'brand-adani',
      name: 'ADANI',
      slug: 'adani',
      logo_url: getMediaUrl('brand_logo_adani', 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Adani_Group_logo.svg'),
      link: '/brands/adani'
    },
    {
      id: 'brand-waaree',
      name: 'WAAREE',
      slug: 'waaree',
      logo_url: getMediaUrl('brand_logo_waaree', 'https://www.waaree.com/images/logo.png'),
      link: '/brands/waaree'
    },
    {
      id: 'brand-kent',
      name: 'KENT',
      slug: 'kent',
      logo_url: getMediaUrl('brand_logo_kent', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Kent_RO_Systems_Logo.png'),
      link: '/brands/kent'
    }
  ];

  // Map each brand to check if there is a matching brand from the database
  const items = defaultBrands.map(defBrand => {
    const dbBrand = brands?.find(b => 
      b.slug?.toLowerCase() === defBrand.slug || 
      b.name?.toLowerCase().replace(/[^a-z0-9]/g, '') === defBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    
    return {
      id: dbBrand?.id || defBrand.id,
      name: dbBrand?.name || defBrand.name,
      slug: dbBrand?.slug || defBrand.slug,
      logo_url: dbBrand?.logo_url || defBrand.logo_url,
      link: `/brands/${dbBrand?.slug || defBrand.slug}`
    };
  });

  // We need enough items to fill the screen twice to ensure a seamless infinite loop.
  const MIN_ITEMS = 12;
  const loopMultiplier = Math.ceil(MIN_ITEMS / items.length);
const repeatedItems = Array(loopMultiplier).fill(items).flat();
  itemsCountRef.current = repeatedItems.length;
  
  // For the continuous marquee, duplicate the fully populated set exactly once.
  const sliderItems = [...repeatedItems, ...repeatedItems];

  // Calculate duration based on the number of unique items in one half, 
  // so the scrolling speed remains visually consistent regardless of item count.
  const baseSpeedPerItem = 3; // seconds per item
  const animationDuration = repeatedItems.length * baseSpeedPerItem;

    // Calculate card width based on viewport
    useEffect(() => {
      const updateCardWidth = () => {
        const width = window.innerWidth;
        let newWidth = 200; // default md
        if (width >= 1024) { // lg
          newWidth = 230 + 32; // 230px + px-4 (16px * 2)
        } else if (width >= 768) { // md
          newWidth = 200 + 24; // 200px + px-3 (12px * 2)
        } else { // mobile
          newWidth = 150 + 16; // 150px + px-2 (8px * 2)
        }
        setCardWidth(newWidth);
        cardWidthRef.current = newWidth;
      };
      updateCardWidth();
      window.addEventListener('resize', updateCardWidth);
      return () => window.removeEventListener('resize', updateCardWidth);
    }, []);

    // Auto-animation loop
    const startAutoAnimation = useCallback(() => {
      if (autoAnimationRef.current) return;
      
      const totalWidth = itemsCountRef.current * cardWidthRef.current;
      const halfWidth = totalWidth / 2; // -50% position in pixels
      
      autoAnimationRef.current = { cancel: false };
      
      const runAnimation = async () => {
        const controller = autoAnimationRef.current;
        if (!controller || controller.cancel) return;
        
        // Animate from current position to -halfWidth
        const currentX = x.get();
        const remainingDistance = Math.abs(currentX + halfWidth);
        const remainingDuration = (remainingDistance / halfWidth) * animationDuration * 1000; // ms
        
        try {
          await animate(x, -halfWidth, {
            duration: Math.max(remainingDuration, 100),
            ease: 'linear'
          });
        } catch (e) {
          return; // Animation was cancelled
        }
        
        // Check if cancelled during animation
        if (!controller || controller.cancel) return;
        
        // Seamless loop: jump back to 0
        x.set(0);
        
        // Continue the loop
        if (!controller.cancel) {
          runAnimation();
        }
      };
      
      runAnimation();
    }, [animationDuration, x]);

    // Stop auto animation
    const stopAutoAnimation = useCallback(() => {
      if (autoAnimationRef.current) {
        autoAnimationRef.current.cancel = true;
        autoAnimationRef.current = null;
      }
    }, []);

    // Manual navigation
    const navigate = useCallback((direction: 'prev' | 'next') => {
      if (isManualNavRef.current) return;
      isManualNavRef.current = true;
      
      stopAutoAnimation();
      
      const currentX = x.get();
      const step = direction === 'next' ? -cardWidthRef.current : cardWidthRef.current;
      const targetX = currentX + step;
      
      // Animate to the new position
      animate(x, targetX, {
        duration: 0.5,
        ease: 'easeOut'
      }).then(() => {
        // Handle boundary conditions for seamless loop
        const totalWidth = itemsCountRef.current * cardWidthRef.current;
        const halfWidth = totalWidth / 2;
        
        let newX = targetX;
        if (newX <= -halfWidth) {
          newX += halfWidth; // Wrap to beginning
        } else if (newX > 0) {
          newX -= halfWidth; // Wrap to end
        }
        
        if (newX !== targetX) {
          x.set(newX);
        }
        
        isManualNavRef.current = false;
        // Resume auto animation after a brief delay
        setTimeout(() => {
          if (!isManualNavRef.current) {
            startAutoAnimation();
          }
        }, 100);
      });
    }, [x, startAutoAnimation, stopAutoAnimation]);

    // Start auto animation on mount
    useEffect(() => {
      startAutoAnimation();
      return () => stopAutoAnimation();
    }, [startAutoAnimation, stopAutoAnimation]);

    // Pause on hover
    const handleMouseEnter = useCallback(() => {
      stopAutoAnimation();
    }, [stopAutoAnimation]);

    const handleMouseLeave = useCallback(() => {
      if (!isManualNavRef.current) {
        startAutoAnimation();
      }
    }, [startAutoAnimation]);

    return (
      <section id="brands" className="py-8 md:py-16 lg:py-20 bg-white border-none overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
          
          <div className="flex items-center justify-between mb-4 md:mb-10">
            <h2 className="text-lg md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
              Shop by Brands
            </h2>
          </div>

          <div 
            className="w-full relative overflow-hidden group" 
            ref={sliderTrackRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Fading edges for a premium look */}
            <div className="absolute top-0 left-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Navigation Arrows */}
            <button
              onClick={() => navigate('prev')}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md text-gray-700 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
              aria-label="Previous brand"
            >
              <ChevronLeft size={20} className="ml-1" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md text-gray-700 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
              aria-label="Next brand"
            >
              <ChevronRight size={20} className="mr-1" />
            </button>

            <motion.div
              style={{ x }}
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
                        className="max-w-[85%] max-h-[80%] object-contain group-hover:scale-110 transition-transform duration-500"
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
                      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-800 font-heading font-black text-center p-4 border border-gray-100 rounded-xl"
                      style={{ display: brand.logo_url ? 'none' : 'flex' }}
                    >
                      <span className="text-[10px] tracking-widest text-brand-green uppercase font-black mb-1">BRAND</span>
                      <span className="text-sm md:text-base font-extrabold uppercase tracking-tight text-gray-900 leading-tight">
                        {brand.name}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-center text-sm md:text-base group-hover:text-brand-green transition-colors mt-auto">
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
