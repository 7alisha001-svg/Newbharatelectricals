import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Target, Users, CheckCircle2, Building, 
  Warehouse, MapPin, Phone, Award, Clock, HeartHandshake,
  Lightbulb, Cog, TrendingUp, ThumbsUp, X, Star, Sun, Truck, Headset
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function AboutUsPage() {
  const { settings } = useStore();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const galleryImages = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", // Warehouse / Industrial
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", // Team
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop", // Meeting / Office
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop", // Products / Industrial
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop", // Office / Building
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"  // Team interaction
  ];

  const values = [
    { icon: Award, title: "Quality", desc: "Uncompromising standards in every product." },
    { icon: Shield, title: "Trust", desc: "Building lasting relationships with reliability." },
    { icon: HeartHandshake, title: "Customer Satisfaction", desc: "Putting our customers' needs first." },
    { icon: Lightbulb, title: "Innovation", desc: "Embracing modern electrical and solar tech." },
    { icon: Target, title: "Professional Service", desc: "Expert guidance and meticulous execution." },
    { icon: Headset, title: "Reliable Support", desc: "Always here when you need assistance." },
  ];

  const reasons = [
    { icon: CheckCircle2, title: "Genuine Products", desc: "100% authentic and certified equipment." },
    { icon: Users, title: "Experienced Team", desc: "Over 50+ dedicated professionals." },
    { icon: TrendingUp, title: "Competitive Pricing", desc: "Best value without compromising quality." },
    { icon: Sun, title: "Solar & Electrical Expertise", desc: "Specialized knowledge in power solutions." },
    { icon: Truck, title: "Fast Delivery", desc: "Efficient logistics and distribution network." },
    { icon: Cog, title: "Technical Support", desc: "Comprehensive installation and maintenance help." },
    { icon: Shield, title: "Trusted Service", desc: "A proven track record of excellence." },
    { icon: ThumbsUp, title: "Customer Satisfaction", desc: "Dedicated to exceeding your expectations." },
  ];

  const stats = [
    { value: "50+", label: "Professional Employees" },
    { value: "1000+", label: "Happy Customers" },
    { value: "5000+", label: "Products Delivered" },
    { value: "100%", label: "Customer Commitment" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>About Us | New Bharat Electricals</title>
        <meta name="description" content="Discover the story of New Bharat Electricals. Learn about our founder Mazhar Hussain, our expert team, and our commitment to premium electrical and solar solutions." />
        <meta name="keywords" content="Electrical Solutions, Solar Solutions, Power Solutions, Inverters, Batteries, Solar Panels, Budaun Electrical Store, New Bharat Electricals, Mazhar Hussain" />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative bg-brand-dark py-16 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/80 to-brand-dark z-10" />
          <img 
            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop" 
            alt="New Bharat Electricals Facility" 
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 relative z-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-white mb-6 uppercase tracking-tight drop-shadow-lg"
          >
            Powering Trust.<br />
            <span className="text-brand-lime">Delivering Excellence.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "6rem" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1.5 bg-brand-green mx-auto mb-8 rounded-full"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-lg md:text-2xl max-w-3xl mx-auto font-semibold tracking-wide drop-shadow-md"
          >
            Your premier destination for high-performance Power Solutions, Solar Energy Systems, and essential Electrical Products.
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest">Our Heritage</h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight">
                The Story of <br/>New Bharat Electricals
              </h3>
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                Established with a vision to revolutionize the way homes and businesses access energy, New Bharat Electricals has grown into a trusted pillar in the electrical and solar industry. From our humble beginnings to our current expansive operations, our journey has been fueled by a relentless commitment to quality and customer satisfaction.
              </p>
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                We believe that reliable power is the backbone of modern progress. That is why we curate and supply only the finest inverters, batteries, solar panels, and electrical accessories. Our long-term relationships with customers are built on a foundation of trust, transparent business practices, and an unwavering dedication to delivering excellence.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group"
            >
              <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=1000&auto=format&fit=crop" 
                alt="Our Facility" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-2">Our Leadership</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
              Meet The Directors
            </h3>
            <div className="w-16 h-1 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Founder */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-200 relative">
                {/* Placeholder for Founder Photo */}
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
                  alt="Mazhar Hussain - Founder & Owner"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  loading="lazy"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <h4 className="text-2xl font-black text-gray-900 mb-1 font-heading">Mazhar Hussain</h4>
                <p className="text-brand-green font-bold text-sm tracking-widest uppercase mb-6">Founder & Owner</p>
                <p className="text-gray-800 leading-relaxed text-base font-medium flex-1">
                  Guided by a profound vision for sustainable energy and reliable infrastructure, Mazhar Hussain laid the foundation of New Bharat Electricals. His leadership is defined by an uncompromising dedication to customer satisfaction, ethical business practices, and a commitment to providing the highest quality electrical and solar solutions in the region.
                </p>
              </div>
            </motion.div>

            {/* Manager */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-200 relative">
                {/* Placeholder for Manager Photo */}
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" 
                  alt="Sahib Mazhar - Manager"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  loading="lazy"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <h4 className="text-2xl font-black text-gray-900 mb-1 font-heading">Sahib Mazhar</h4>
                <p className="text-brand-green font-bold text-sm tracking-widest uppercase mb-6">Manager</p>
                <p className="text-gray-800 leading-relaxed text-base font-medium flex-1">
                  Sahib Mazhar drives the daily operations with exceptional organizational skills and a dynamic approach to team coordination. He plays a pivotal role in nurturing customer relationships, streamlining distribution logistics, and ensuring that our 50+ professional employees deliver excellent service seamlessly, every single day.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-20 bg-brand-dark text-white text-center">
        <div className="max-w-[800px] mx-auto px-4">
          <Users size={64} className="mx-auto text-brand-lime mb-6" />
          <h3 className="text-3xl md:text-5xl font-heading font-black uppercase tracking-tight mb-6">
            Our Strength: 50+ Dedicated Professionals
          </h3>
          <p className="text-white text-lg md:text-xl font-semibold leading-relaxed">
            Behind every successful product delivery and installation is our formidable team. With over 50 skilled employees working in harmony, we ensure that every client receives personalized attention, prompt service, and expert technical guidance. Our team is the true powerhouse of New Bharat Electricals.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-brand-green">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <h4 className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tight drop-shadow-md">
                  {stat.value}
                </h4>
                <p className="text-white font-extrabold text-sm md:text-base uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-2">Core Principles</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
              Our Values
            </h3>
            <div className="w-16 h-1 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-green transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-green/10 transition-colors">
                  <val.icon size={28} className="text-gray-900 group-hover:text-brand-green transition-colors" />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3 font-heading">{val.title}</h4>
                <p className="text-gray-700 font-medium leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-2">Advantages</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
              Why Choose Us
            </h3>
            <div className="w-16 h-1 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {reasons.map((reason, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-brand-dark p-6 rounded-2xl text-center group hover:bg-gray-900 transition-colors border border-gray-800"
              >
                <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-green transition-colors">
                  <reason.icon size={20} className="text-brand-lime group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{reason.title}</h4>
                <p className="text-gray-200 text-sm font-semibold">{reason.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Events & Gallery */}
      <section className="py-16 md:py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-2">Life At New Bharat</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
              Events & Gallery
            </h3>
            <div className="w-16 h-1 bg-brand-green mx-auto rounded-full mb-6" />
            <p className="text-gray-700 max-w-2xl mx-auto font-medium text-lg">
              A glimpse into our team events, company celebrations, customer visits, product launches, and warehouse activities.
            </p>
          </div>

          {/* Masonry / Grid Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {galleryImages.map((src, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group shadow-sm hover:shadow-xl transition-all"
                onClick={() => setLightboxImage(src)}
              >
                <img 
                  src={src} 
                  alt={`Gallery Image ${idx + 1}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-brand-lime transition-colors p-2"
              onClick={() => setLightboxImage(null)}
            >
              <X size={36} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImage} 
              alt="Expanded view" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-green uppercase tracking-widest mb-2">Reach Us</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
              Our Locations
            </h3>
            <div className="w-16 h-1 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Office Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-xl hover:border-brand-green transition-all"
            >
              <div className="p-8 pb-8 flex-1">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-green mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Building size={32} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2 font-heading">Head Office</h3>
                <h4 className="text-brand-green font-bold text-lg mb-6 uppercase tracking-wider">{settings?.business_name || 'New Bharat Electricals'}</h4>
                
                <div className="flex items-start text-gray-800 mb-6 gap-4">
                  <MapPin size={24} className="mt-1 flex-shrink-0 text-brand-green" />
                  <p className="leading-relaxed text-lg font-medium tracking-wide whitespace-pre-line">
                    Near Dr Amar Singh, Chaudhry Sarai,
                    Lalpul Road,
                    Budaun HO,
                    Budaun – 243601,
                    Uttar Pradesh
                  </p>
                </div>
              </div>
              
              <div className="w-full h-[250px] bg-gray-200 relative">
                {/* Google Map Placeholder */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.3102435798993!2d79.11718047535552!3d28.02640207599026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a008c2306d1dd5%3A0xe979dcc4999f7d0c!2sNew%20Bharat%20Electricals!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Head Office Location"
                ></iframe>
              </div>
            </motion.div>

            {/* Warehouse Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-xl hover:border-brand-green transition-all"
            >
              <div className="p-8 pb-8 flex-1">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-green mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Warehouse size={32} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2 font-heading">Warehouse</h3>
                <h4 className="text-gray-900 font-bold text-lg mb-6 uppercase tracking-wider">Distribution & Logistics</h4>
                
                <div className="flex items-start text-gray-800 mb-6 gap-4">
                  <MapPin size={24} className="mt-1 flex-shrink-0 text-brand-green" />
                  <p className="leading-relaxed text-lg font-medium tracking-wide whitespace-pre-line">
                    Budaun,
                    Loda Bahedi,
                    Uttar Pradesh – 243601
                  </p>
                </div>
              </div>
              
              <div className="w-full h-[250px] bg-gray-200 relative">
                 {/* Google Map Placeholder */}
                 <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.3102435798993!2d79.11718047535552!3d28.02640207599026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a008c2306d1dd5%3A0xe979dcc4999f7d0c!2sNew%20Bharat%20Electricals!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Warehouse Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-dark py-16 md:py-24 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="max-w-[1000px] mx-auto px-4 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight mb-6">
            Ready to Upgrade Your <span className="text-brand-lime">Power Solutions?</span>
          </h2>
          <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto font-semibold tracking-wide">
            Get expert consultation for Power Solutions, Solar Systems, and Electrical Products from the industry leaders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/contact" className="bg-brand-green text-white font-bold px-8 md:px-12 py-4 md:py-5 rounded-2xl hover:bg-brand-green-dark transition-colors uppercase tracking-widest text-sm shadow-xl hover:shadow-brand-green/30">
              Get Expert Consultation
            </Link>
            <Link to="/catalogue" className="bg-transparent border-2 border-white text-white font-bold px-8 md:px-12 py-4 md:py-5 rounded-2xl hover:bg-white hover:text-brand-dark transition-colors uppercase tracking-widest text-sm">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

