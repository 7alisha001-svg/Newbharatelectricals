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
    <section className="relative w-full overflow-hidden bg-[#f4f4f4] border-b border-gray-200">
      <div className="relative w-full h-[650px] md:h-[550px] lg:h-[600px] group flex">
        {/* The 3D Table/Floor Background Effect */}
        <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-b from-[#e0e0e0] to-[#c5c5c5] border-t border-white/60 shadow-inner z-0"></div>

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
              <div className="flex flex-col md:flex-row items-center h-full pt-8 md:pt-0">
                
                {/* Left Content */}
                <div className="w-full md:w-7/12 flex flex-col justify-center text-center md:text-left z-20 md:pr-8 lg:pr-12 h-full pt-10 md:pt-0 pb-16 md:pb-24">
                  
                  {/* Pre-title */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex items-center justify-center md:justify-start gap-4 mb-3 lg:mb-4"
                  >
                    <div className="hidden md:block h-0.5 w-16 bg-gray-900 shadow-sm"></div>
                    <span className="text-gray-900 font-bold text-xs sm:text-sm md:text-xl lg:text-2xl xl:text-3xl tracking-widest sm:tracking-[0.15em] uppercase">
                      {heroSlides[currentSlide].preTitle}
                    </span>
                    <div className="hidden lg:block h-0.5 w-24 bg-gray-900 shadow-sm"></div>
                  </motion.div>
                  
                  {/* High Impact Title */}
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className={`text-[30px] sm:text-[46px] leading-[1] sm:leading-[0.9] md:text-[60px] lg:text-[75px] xl:text-[90px] font-heading font-black uppercase mb-6 sm:mb-8 md:mb-12 drop-shadow-sm ${heroSlides[currentSlide].themeText}`}
                  >
                    {heroSlides[currentSlide].titlePart1} <span className="text-gray-900">{heroSlides[currentSlide].titlePart2}</span>
                  </motion.h1>
                  
                  {/* Features */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="flex justify-center md:justify-start gap-5 md:gap-8 lg:gap-14 mb-10"
                  >
                    {heroSlides[currentSlide].features.map((feature, idx) => (
                      <div key={idx} className="flex flex-col items-center group/icon cursor-default">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-800 bg-white flex items-center justify-center mb-3 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] group-hover/icon:-translate-y-1 transition-transform">
                          <feature.icon className="w-7 h-7 md:w-9 md:h-9 text-gray-900" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-900 uppercase tracking-widest leading-tight text-center whitespace-pre-line drop-shadow-sm">
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
                    <Link to={heroSlides[currentSlide].ctaLink} className="inline-block bg-gradient-to-b from-gray-700 to-gray-950 text-white font-black px-12 py-3.5 shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest text-lg border border-gray-600/50">
                      {heroSlides[currentSlide].ctaText}
                    </Link>
                  </motion.div>
                </div>
                
                {/* Right Image Container */}
                <div className="w-full md:w-5/12 h-[35%] md:h-full relative flex flex-col items-center justify-end md:justify-center z-10 pb-6 md:pb-0">
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                    className="w-full h-full md:h-[80%] flex items-center justify-center relative md:translate-y-8"
                  >
                    <img 
                      src={heroSlides[currentSlide].image} 
                      alt="Product Promo"
                      className="max-h-full w-auto max-w-[95%] object-cover rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-[6px] border-white relative z-20 group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>

                  {/* Mobile CTA */}
                  <div className="md:hidden mt-6 relative z-30">
                    <Link to={heroSlides[currentSlide].ctaLink} className="inline-block bg-gradient-to-b from-gray-700 to-gray-950 text-white font-black px-10 py-3 shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest text-base border border-gray-600/50">
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
            className="pointer-events-auto bg-white/90 hover:bg-white text-gray-800 border border-gray-200 shadow-xl p-3 md:p-4 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="pointer-events-auto bg-white/90 hover:bg-white text-gray-800 border border-gray-200 shadow-xl p-3 md:p-4 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight size={28} strokeWidth={1.5} />
          </button>
        </div>

      </div>
    </section>
  );
}
