import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Sun, Microchip, BatteryCharging, ChevronRight, Home } from 'lucide-react';
import { formatSlugToTitle } from '../utils/formatters';

export default function GenericCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const title = formatSlugToTitle(category);

  // Dynamic logic to figure out subcategories for this category to render placeholder grid
  let subcategories: { name: string; slug: string; desc: string; icon: any }[] = [];

  if (category === 'power-solutions') {
    subcategories = [
      { name: 'UPS Systems', slug: 'ups-systems', desc: 'High reliability UPS for critical loads.', icon: <Zap size={24} /> },
      { name: 'Home Inverters', slug: 'home-inverters', desc: 'Keep your home powered during outages.', icon: <Zap size={24} /> },
      { name: 'Industrial Inverters', slug: 'industrial-inverters', desc: 'Heavy duty inverters for large scale operations.', icon: <Microchip size={24} /> },
      { name: 'Battery Backup Systems', slug: 'battery-backup-systems', desc: 'Long-lasting power storage solutions.', icon: <BatteryCharging size={24} /> },
      { name: 'Power Backup Solutions', slug: 'power-backup-solutions', desc: 'Comprehensive blackout protection.', icon: <Zap size={24} /> },
    ];
  } else if (category === 'solar-solutions') {
    subcategories = [
      { name: 'Residential Solar Panels', slug: 'residential-solar-panels', desc: 'Harness the sun for your home.', icon: <Sun size={24} /> },
      { name: 'Commercial Solar Panels', slug: 'commercial-solar-panels', desc: 'Reduce your business electricity bills.', icon: <Sun size={24} /> },
      { name: 'Industrial Solar Projects', slug: 'industrial-solar-projects', desc: 'Large scale solar deployments.', icon: <Sun size={24} /> },
      { name: 'Solar Inverters', slug: 'solar-inverters', desc: 'Efficient DC to AC conversion.', icon: <Microchip size={24} /> },
      { name: 'Solar Battery Storage', slug: 'solar-battery-storage', desc: 'Store solar energy for night use.', icon: <BatteryCharging size={24} /> },
      { name: 'Solar Installation Services', slug: 'solar-installation-services', desc: 'Professional mounting and wiring.', icon: <Sun size={24} /> },
      { name: 'Rooftop Solar Solutions', slug: 'rooftop-solar-solutions', desc: 'Turn your roof into a power plant.', icon: <Sun size={24} /> },
    ];
  } else if (category === 'mobility-solutions') {
    subcategories = [
      { name: 'E-Rickshaw Batteries', slug: 'e-rickshaw-batteries', desc: 'Durable batteries for daily transit.', icon: <BatteryCharging size={24} /> },
      { name: 'EV Battery Solutions', slug: 'ev-battery-solutions', desc: 'Next-generation EV power cells.', icon: <BatteryCharging size={24} /> },
      { name: 'Charging Support', slug: 'charging-support', desc: 'Fast and reliable charging networks.', icon: <Zap size={24} /> },
      { name: 'Automotive Battery Solutions', slug: 'automotive-battery-solutions', desc: 'Start your vehicle with confidence.', icon: <BatteryCharging size={24} /> },
    ];
  } else if (category === 'accessories') {
    subcategories = [
      { name: 'Solar Connectors', slug: 'solar-connectors', desc: 'MC4 and weatherproof connectors.', icon: <Microchip size={24} /> },
      { name: 'Wiring Accessories', slug: 'wiring-accessories', desc: 'High quality copper structured wiring.', icon: <Zap size={24} /> },
      { name: 'Electrical Cables', slug: 'electrical-cables', desc: 'Industrial grade insulated cables.', icon: <Zap size={24} /> },
      { name: 'Switches', slug: 'switches', desc: 'Modern and durable switchgears.', icon: <Microchip size={24} /> },
      { name: 'Installation Accessories', slug: 'installation-accessories', desc: 'Mounts, brackets, and rails.', icon: <Microchip size={24} /> },
      { name: 'Battery Accessories', slug: 'battery-accessories', desc: 'Terminals, water indicators, and racks.', icon: <BatteryCharging size={24} /> },
    ];
  }

  // Choose a generic background image based on category
  const bgImage = category === 'solar-solutions' 
    ? 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop'
    : category === 'mobility-solutions'
    ? 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2500&auto=format&fit=crop';

  return (
    <>
      <Helmet>
        <title>{title} | New Bharat Electricals</title>
        <meta name="description" content={`Explore our premium range of ${title.toLowerCase()} configured for efficiency, reliability, and maximum performance by New Bharat Electricals.`} />
      </Helmet>
      <div className="w-full bg-white pb-20">
        
        {/* Breadcrumb Header */}
        <div className="bg-brand-gray/50 py-4 border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="flex items-center text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap hide-scrollbar">
              <Link to="/" className="text-gray-400 hover:text-brand-green flex items-center"><Home size={14} className="mr-1" /> Home</Link>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <span className="text-brand-green font-bold">{title}</span>
            </div>
          </div>
        </div>

        {/* Category Hero */}
      <section className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center overflow-hidden bg-brand-dark mb-12">
        <motion.div 
          initial={{ scale: 1.02 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0 bg-cover bg-center origin-center"
          style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 40%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-transparent"></div>
        </motion.div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-heading font-bold mb-2 text-white"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base md:text-lg text-gray-300 max-w-2xl"
          >
            Explore our premium range of {title.toLowerCase()} configured for efficiency, reliability, and maximum performance.
          </motion.p>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 border-l-4 border-brand-green pl-3">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subcategories.map((sub, idx) => (
            <motion.div
              key={sub.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/${category}/${sub.slug}`} className="block h-full group">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-brand-green hover:shadow-md transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                  <div className="text-brand-green mb-4 w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                    {sub.icon}
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-gray-900 group-hover:text-brand-green transition-colors">{sub.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-grow">{sub.desc}</p>
                  
                  <div className="inline-flex items-center text-brand-green font-bold text-xs uppercase tracking-wide mt-auto">
                    View Range <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
