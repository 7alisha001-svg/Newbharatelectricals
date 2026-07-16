import { motion } from 'motion/react';
import { Shield, Zap, Target, Users, CheckCircle2, Building, Warehouse, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function AboutUsPage() {
  const { settings } = useStore();
  
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>About Us | New Bharat Electricals</title>
        <meta name="description" content="Learn more about New Bharat Electricals, our mission, vision, and commitment to providing high-quality electrical and solar solutions." />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative bg-brand-dark py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
            alt="About Us Background" 
            className="w-full h-full object-cover"
           onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative z-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 uppercase tracking-tight"
          >
            About Us
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-brand-green mx-auto mb-6"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-100 text-lg md:text-2xl max-w-2xl mx-auto font-medium tracking-wide"
          >
            Powering Every Home & Business with trusted electrical and solar solutions.
          </motion.p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-4">
                Welcome to <span className="text-brand-green">New Bharat Electricals</span>
              </h2>
              <p className="text-gray-900 leading-relaxed text-lg md:text-xl font-medium tracking-wide">
                New Bharat Electricals is a leading provider of comprehensive electrical and solar solutions. With years of industry experience, we are dedicated to delivering high-quality products that meet the diverse needs of our residential, commercial, and industrial clients.
              </p>
              <p className="text-gray-900 leading-relaxed text-lg md:text-xl font-medium tracking-wide mt-4">
                Our extensive product range includes premium inverters, durable batteries, advanced solar panels, and essential electrical accessories. We partner with top brands and manufacturers to ensure that every product we offer stands for reliability, efficiency, and longevity.
              </p>
              <div className="pt-4">
                <Link to="/contact" className="inline-block bg-brand-dark text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-green transition-colors uppercase tracking-widest text-sm">
                  Contact Us Today
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]"
            >
              <img 
                src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=1000&auto=format&fit=crop" 
                alt="Our Facility" 
                className="w-full h-full object-cover"
               onError={(e) => { const target = e.currentTarget; if (!target.src.includes('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')) { target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; } }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 md:py-16 bg-[#f8f9fa] border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-md border-none relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-green transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <Target size={48} className="text-brand-green mb-6" />
              <h3 className="text-3xl font-heading font-black text-gray-900 uppercase tracking-tight mb-5">Our Mission</h3>
              <p className="text-gray-900 leading-relaxed text-lg md:text-xl font-medium tracking-wide">
                To empower our customers with innovative, reliable, and energy-efficient electrical solutions. We strive to provide exceptional service, foster sustainable practices, and contribute to the growth and development of the communities we serve.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-brand-dark p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl" />
              <Zap size={48} className="text-brand-green mb-6" />
              <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tight mb-5">Our Vision</h3>
              <p className="text-gray-100 leading-relaxed text-lg md:text-xl font-medium tracking-wide">
                To be the most trusted and preferred partner for all electrical and solar energy needs across the nation, recognized for our commitment to quality, technological advancement, and customer satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
              Why Choose Us
            </h2>
            <div className="w-20 h-1.5 bg-brand-green mx-auto mb-8" />
            <p className="text-gray-900 max-w-2xl mx-auto text-lg md:text-xl font-medium tracking-wide">
              We stand apart through our dedication to excellence and our customer-first approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Trusted Quality", desc: "We source and supply only genuine, high-quality products from reputable manufacturers." },
              { icon: Users, title: "Expert Support", desc: "Our team of knowledgeable professionals is always ready to assist you with technical guidance." },
              { icon: CheckCircle2, title: "Reliable Service", desc: "From timely deliveries to after-sales support, we ensure a seamless experience." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-8 rounded-3xl hover:bg-white transition-all border border-transparent hover:border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="w-20 h-20 mx-auto bg-brand-green/10 rounded-full flex items-center justify-center mb-6 text-brand-green">
                  <feature.icon size={36} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-900 leading-relaxed text-lg font-medium tracking-wide">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-10 md:py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
              Our Locations
            </h2>
            <div className="w-20 h-1.5 bg-brand-green mx-auto mb-8" />
            <p className="text-gray-900 max-w-2xl mx-auto text-lg md:text-xl font-medium tracking-wide">
              Visit our corporate office or warehouse for all your electrical and solar needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Office Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md border-none overflow-hidden flex flex-col"
            >
              <div className="p-8 pb-6 flex-1">
                <div className="w-16 h-16 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green mb-6">
                  <Building size={32} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">Corporate Office</h3>
                <h4 className="text-brand-green font-bold text-lg mb-4">{settings?.business_name || 'New Bharat Electricals'}</h4>
                
                <div className="flex items-start text-gray-900 mb-4 gap-3">
                  <MapPin size={24} className="mt-1 flex-shrink-0 text-brand-green" />
                  <p className="leading-relaxed text-lg font-medium tracking-wide whitespace-pre-line">
                    {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.address || 
                     settings?.office_address || 
                     'Near Dr Amar Singh,\nChaudhry Sarai,\nLalpul Road,\nBudaun HO,\nBudaun – 243601,\nUttar Pradesh'}
                  </p>
                </div>
                
                {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.phone && (
                  <div className="flex items-center text-gray-900 gap-3 mb-6 text-lg font-medium tracking-wide">
                    <Phone size={24} className="flex-shrink-0 text-brand-green" />
                    <a href={`tel:${settings.social_links.locations.find((l: any) => l.type === 'office').phone}`} className="hover:text-brand-green transition-colors">
                      {settings.social_links.locations.find((l: any) => l.type === 'office').phone}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="w-full h-[250px] bg-gray-100 relative">
                {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.map_embed_code ? (
                   <div 
                     className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                     dangerouslySetInnerHTML={{ __html: settings.social_links.locations.find((l: any) => l.type === 'office').map_embed_code }}
                   />
                ) : (
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.3102435798993!2d79.11718047535552!3d28.02640207599026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a008c2306d1dd5%3A0xe979dcc4999f7d0c!2sNew%20Bharat%20Electricals!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                )}
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <a 
                  href={settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.map_link || 'https://maps.google.com/?q=New+Bharat+Electricals,Budaun'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-brand-dark text-white text-center font-bold py-3 rounded-2xl hover:bg-brand-green transition-colors"
                >
                  Get Directions
                </a>
                {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.phone && (
                   <a 
                     href={`tel:${settings.social_links.locations.find((l: any) => l.type === 'office').phone}`}
                     className="flex-1 bg-white text-brand-dark border border-gray-200 text-center font-bold py-3 rounded-2xl hover:border-brand-green hover:text-brand-green transition-colors"
                   >
                     Call Now
                   </a>
                )}
              </div>
            </motion.div>

            {/* Warehouse Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md border-none overflow-hidden flex flex-col"
            >
              <div className="p-8 pb-6 flex-1">
                <div className="w-16 h-16 bg-brand-dark/5 rounded-xl flex items-center justify-center text-brand-dark mb-6">
                  <Warehouse size={32} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">Warehouse</h3>
                <h4 className="text-gray-900 font-medium font-bold text-lg mb-4">Distribution & Logistics</h4>
                
                <div className="flex items-start text-gray-900 mb-4 gap-3">
                  <MapPin size={24} className="mt-1 flex-shrink-0 text-brand-green" />
                  <p className="leading-relaxed text-lg font-medium tracking-wide whitespace-pre-line">
                    {settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.address || 
                     settings?.warehouse_address || 
                     'Budaun,\nLoda Bahedi,\nUttar Pradesh – 243601'}
                  </p>
                </div>
              </div>
              
              <div className="w-full h-[250px] bg-gray-100 relative">
                {settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.map_embed_code ? (
                   <div 
                     className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                     dangerouslySetInnerHTML={{ __html: settings.social_links.locations.find((l: any) => l.type === 'warehouse').map_embed_code }}
                   />
                ) : (
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.3102435798993!2d79.11718047535552!3d28.02640207599026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a008c2306d1dd5%3A0xe979dcc4999f7d0c!2sNew%20Bharat%20Electricals!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                )}
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <a 
                  href={settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.map_link || 'https://maps.google.com/?q=Loda+Bahedi,Budaun'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-brand-dark text-white text-center font-bold py-3 rounded-2xl hover:bg-brand-green transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-green py-16">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tight mb-6">
            Ready to Upgrade Your Power Solutions?
          </h2>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto font-medium tracking-wide">
            Explore our extensive catalog or get in touch with our experts to find the perfect electrical or solar setup for your requirements.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalogue" className="bg-brand-dark text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl">
              View Catalog
            </Link>
            <Link to="/contact" className="bg-white text-brand-dark font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
