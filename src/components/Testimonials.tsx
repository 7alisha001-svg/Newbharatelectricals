import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Solar Installer',
    location: 'Delhi',
    content: 'New Bharat Electricals solar panels are top-notch. High efficiency and incredible durability. My clients are extremely satisfied with their performance.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Homeowner',
    location: 'Noida',
    content: 'We installed their home inverter and battery setup last year. During power cuts, the transition is seamless. Highly reliable and silent operation.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Commercial Developer',
    location: 'Gurugram',
    content: 'For our large scale industrial setups, we only trust New Bharat Electricals. Their 3-phase inverters deliver the rugged performance we need.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-5 md:py-16 lg:py-20 bg-brand-gray border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-8 gap-1 md:gap-4">
          <h2 className="text-lg md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Customer Reviews
          </h2>
          <p className="text-gray-900 text-sm md:text-lg font-medium tracking-wide">
            Trust built on excellence and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:border-brand-green transition-all duration-300 relative group"
            >
              <Quote className="absolute top-5 right-5 md:top-6 md:right-6 text-brand-green/5 group-hover:text-brand-green/10 transition-colors" size={36} />
              
               <div className="flex items-center space-x-1 mb-2 md:mb-4 text-yellow-500">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
              
               <p className="text-gray-900 mb-3 md:mb-6 leading-relaxed relative z-10 text-sm md:text-base font-medium tracking-wide">
                "{testimonial.content}"
              </p>
              
               <div className="flex items-center mt-auto border-t border-gray-50 pt-2 md:pt-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-gray flex items-center justify-center text-brand-green font-bold text-sm mr-3 flex-shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-green transition-colors">{testimonial.name}</h4>
                  <p className="text-xs text-gray-900 font-medium">{testimonial.role} • {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
