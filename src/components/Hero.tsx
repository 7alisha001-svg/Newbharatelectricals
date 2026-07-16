import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShieldCheck, Zap, Activity, Sun, BatteryCharging, Award, Shield, Droplet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      preTitle: "INTRODUCING THE ULTIMATE",
      titlePart1: "POWER BACK-UP",
      titlePart2: "COMBO!",
      features: [
        { icon: ShieldCheck, text: "SAFE FOR\nAPPLIANCES" },
        { icon: Zap, text: "FAST\nCHARGING" },
        { icon: Activity, text: "LONG LASTING\nPERFORMANCE" }
      ],
      image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=1200&auto=format&fit=crop",
      ctaText: "SHOP NOW",
      ctaLink: "/power-solutions/home-inverters",
      themeText: "text-brand-green"
    },
    {
      preTitle: "EXPERIENCE THE BEST IN",
      titlePart1: "SOLAR ENERGY",
      titlePart2: "SYSTEMS",
      features: [
        { icon: Sun, text: "HIGH\nEFFICIENCY" },
        { icon: BatteryCharging, text: "LOWER\nBILLS" },
        { icon: Award, text: "25 YEAR\nWARRANTY" }
      ],
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
      ctaText: "EXPLORE SOLAR",
      ctaLink: "/solar-solutions/residential-solar-panels",
      themeText: "text-brand-dark"
    },
    {
      preTitle: "HEAVY DUTY PERFORMANCE",
      titlePart1: "INDUSTRIAL",
      titlePart2: "BATTERIES",
      features: [
        { icon: Shield, text: "RUGGED\nDESIGN" },
        { icon: Droplet, text: "LOW\nMAINTENANCE" },
        { icon: Zap, text: "HIGH\nCRANKING" }
      ],
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1200&auto=format&fit=crop",
      ctaText: "BUY NOW",
      ctaLink: "/power-solutions/battery-backup-systems",
      themeText: "text-brand-green"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="relative w-full overflow-hidden bg-[#f4f4f4] border-none">
      <div className="relative w-full h-auto min-h-[400px] sm:min-h-[500px] md:h-[550px] lg:h-[600px] group flex flex-col md:flex-row">
        {/* The 3D Table/Floor Background Effect */}
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-gray-200 to-transparent opacity-60 z-0"></div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full z-10"
          >
            <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8 h-full">
              <div className="flex flex-col md:flex-row items-center h-full pt-4 md:pt-0 pb-4 md:pb-0">
                
                {/* Left Content */}
                <div className="w-full md:w-7/12 flex flex-col justify-center text-center md:text-left z-20 md:pr-8 lg:pr-12 h-auto md:h-full pt-6 md:pt-0 pb-4 md:pb-24">
                  
                  {/* Pre-title */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex items-center justify-center md:justify-start gap-4 mb-2 lg:mb-4"
                  >
                    <div className="hidden md:block h-0.5 w-16 bg-gray-900 shadow-sm"></div>
                    <span className="text-gray-900 font-bold text-[10px] sm:text-xs md:text-lg lg:text-2xl xl:text-3xl tracking-widest sm:tracking-[0.15em] uppercase">
                      {heroSlides[currentSlide].preTitle}
                    </span>
                    <div className="hidden lg:block h-0.5 w-24 bg-gray-900 shadow-sm"></div>
                  </motion.div>
                  
                  {/* High Impact Title */}
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className={`text-3xl sm:text-[40px] leading-tight sm:leading-none tracking-tight md:text-[45px] lg:text-[75px] xl:text-[90px] font-heading font-black uppercase mb-4 sm:mb-6 md:mb-12 drop-shadow-sm ${heroSlides[currentSlide].themeText}`}
                  >
                    {heroSlides[currentSlide].titlePart1} <span className="text-gray-900">{heroSlides[currentSlide].titlePart2}</span>
                  </motion.h1>
                  
                  {/* Features */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="flex justify-center md:justify-start gap-3 sm:gap-5 md:gap-6 lg:gap-14 mb-6 md:mb-10"
                  >
                    {heroSlides[currentSlide].features.map((feature, idx) => (
                      <div key={idx} className="flex flex-col items-center group/icon cursor-default">
                        <div className="w-11 h-11 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-gray-800 bg-white flex items-center justify-center mb-1.5 md:mb-3 shadow-[0_2px_0_0_rgba(0,0,0,0.15)] md:shadow-[0_4px_0_0_rgba(0,0,0,0.15)] group-hover/icon:-translate-y-1 transition-transform">
                          <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-9 lg:h-9 text-gray-900" strokeWidth={1.5} />
                        </div>
                        <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-900 uppercase tracking-wider md:tracking-widest leading-tight text-center whitespace-pre-line drop-shadow-sm">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                  
                  {/* CTA */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="hidden md:block relative z-20"
                  >
                    <Link to={heroSlides[currentSlide].ctaLink} className="inline-block bg-brand-green text-white font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all uppercase tracking-widest text-base border-none hover:bg-brand-orange">
                      {heroSlides[currentSlide].ctaText}
                    </Link>
                  </motion.div>
                </div>
                
                {/* Right Image Container */}
                <div className="w-full md:w-5/12 h-auto md:h-full relative flex flex-col items-center justify-end md:justify-center z-10 pb-6 md:pb-0">
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                    className="w-full h-full md:h-[80%] flex items-center justify-center relative md:translate-y-8"
                  >
                    <img 
                      src={heroSlides[currentSlide].image} 
                      alt="Product Promo"
                      className="max-h-[150px] sm:max-h-[220px] md:max-h-[350px] lg:max-h-full w-auto max-w-[95%] object-cover rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-[4px] md:border-[6px] border-white relative z-20 group-hover:scale-105 transition-transform duration-700"
                     onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
                  </motion.div>

                  {/* Mobile CTA */}
                  <div className="md:hidden mt-4 relative z-30">
                    <Link to={heroSlides[currentSlide].ctaLink} className="inline-block bg-brand-green text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all uppercase tracking-wider text-sm border-none hover:bg-brand-orange">
                      {heroSlides[currentSlide].ctaText}
                    </Link>
                  </div>

                  {/* Tiny disclaimer */}
                  <span className="hidden md:block absolute bottom-6 right-6 text-gray-700 font-bold text-xs uppercase tracking-wider drop-shadow-sm z-20">
                    Range Available*
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 max-w-[1640px] mx-auto px-2 lg:px-4 flex justify-between pointer-events-none z-40">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="pointer-events-auto bg-white/90 hover:bg-white text-gray-900 border border-gray-200 shadow-xl p-3 md:p-4 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="pointer-events-auto bg-white/90 hover:bg-white text-gray-900 border border-gray-200 shadow-xl p-3 md:p-4 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight size={28} strokeWidth={1.5} />
          </button>
        </div>

      </div>
    </section>
  );
}
