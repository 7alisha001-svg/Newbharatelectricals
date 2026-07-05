import { motion } from 'motion/react';
import { Award } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-8 bg-brand-gray border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row border border-gray-100">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
          >
            <div className="inline-flex items-center space-x-2 bg-brand-green-light text-brand-green px-3 py-1 rounded-full mb-4 text-[10px] font-bold uppercase tracking-widest w-max">
              <Award size={14} />
              <span>About The Company</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-black text-gray-900 leading-tight mb-4 uppercase">
              Leading the Way in <br/> Energy Innovation
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
              Based in the heart of UP, New Bharat Electricals has been a pioneer in transforming how homes and businesses consume energy. From rugged tubular batteries to advanced solar power units, we are dedicated to bringing reliable, clean, and continuous power to every corner of India.
            </p>
            
            <div className="flex gap-4">
              <div className="flex flex-col border-l-2 border-brand-green pl-4">
                <span className="text-2xl font-bold text-gray-900 leading-none">15+</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Years Exp.</span>
              </div>
              <div className="flex flex-col border-l-2 border-brand-green pl-4">
                <span className="text-2xl font-bold text-gray-900 leading-none">1M+</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Customers</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative bg-gray-100 min-h-[300px]"
          >
            <img 
              src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop" 
              alt="Electrical Manufacturing" 
              className="absolute inset-0 w-full h-full object-cover"
             onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
