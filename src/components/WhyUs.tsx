import { Award, Users, Sun, Wrench, HeadphonesIcon, Clock } from 'lucide-react';
import { motion } from 'motion/react';

const reasons = [
  {
    icon: <Award size={32} strokeWidth={1.5} />,
    title: 'Premium Quality Products',
    desc: 'Supply genuine electrical and solar products from trusted brands with guaranteed quality.'
  },
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    title: 'Experienced Technical Team',
    desc: 'Our experienced professionals provide expert consultation, installation, and after-sales support.'
  },
  {
    icon: <Sun size={32} strokeWidth={1.5} />,
    title: 'Customized Solar Solutions',
    desc: 'We design solutions tailored to residential, commercial, and industrial energy needs.'
  },
  {
    icon: <Wrench size={32} strokeWidth={1.5} />,
    title: 'Professional Installation',
    desc: 'Safe, efficient, and standards-compliant installation by certified technicians.'
  },
  {
    icon: <HeadphonesIcon size={32} strokeWidth={1.5} />,
    title: 'Trusted Customer Support',
    desc: 'Fast response, transparent communication, and reliable service before and after every project.'
  },
  {
    icon: <Clock size={32} strokeWidth={1.5} />,
    title: 'On-Time Project Delivery',
    desc: 'We complete projects within committed timelines while maintaining the highest quality standards.'
  }
];

export default function WhyUs() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-gray-900 mb-4 uppercase tracking-tight"
          >
            Why Choose New Bharat Electricals
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-gray-600 font-medium leading-relaxed"
          >
            We provide reliable solar and electrical solutions with a strong focus on quality, innovation, customer satisfaction, and long-term performance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-brand-green hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                {reason.icon}
              </div>
              <h3 className="font-heading font-bold text-gray-900 text-xl lg:text-2xl mb-3 tracking-tight group-hover:text-brand-green transition-colors duration-300">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
