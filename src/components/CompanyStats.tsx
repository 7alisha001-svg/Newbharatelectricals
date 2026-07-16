import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'motion/react';

function Counter({ from, to, duration = 2, decimals = 0, suffix = '' }: { from: number; to: number; duration?: number; decimals?: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = value.toFixed(decimals) + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, decimals, suffix, inView]);

  return <span ref={nodeRef}>{from.toFixed(decimals)}{suffix}</span>;
}

const stats = [
  { value: 10, suffix: '+', title: 'Years of Experience', decimals: 0 },
  { value: 200, suffix: '+', title: 'Projects Completed', decimals: 0 },
  { value: 60, suffix: '+ MWp', title: 'Total Installation Capacity', decimals: 0 },
  { value: 0.8, suffix: ' Lakh Tonnes', title: 'Carbon Emissions Reduced', decimals: 1 },
  { value: 6, suffix: '', title: 'States Geographic Reach', decimals: 0 },
  { value: 30, suffix: '+ MWp', title: 'Under Execution', decimals: 0 },
];

export default function CompanyStats() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50/50 border-none">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-gray-900 mb-4 uppercase tracking-tight">
            Our Achievements
          </h2>
          <p className="text-base md:text-lg text-gray-700 font-medium">
            Delivering trusted solar and electrical solutions with proven expertise and measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-green hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-heading font-black text-brand-green mb-2 drop-shadow-sm">
                <Counter from={0} to={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <p className="text-sm md:text-sm text-gray-700 font-bold leading-snug">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
