import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Target, Users, CheckCircle2, Building, 
  Warehouse, MapPin, Phone, Award, Clock, HeartHandshake,
  Lightbulb, Cog, TrendingUp, ThumbsUp, X, Star, Sun, Truck, Headset
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useMedia } from '../context/MediaContext';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import MediaImage from '../components/MediaImage';
import LocationsPreview from '../components/LocationsPreview';

export default function AboutUsPage() {
  const { settings } = useStore();
  const { getMediaUrl } = useMedia();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const galleryCategories = [
    { id: 'All', label: 'All Photos' },
    { id: 'Team', label: 'Our Team' },
    { id: 'Office', label: 'Head Office' },
    { id: 'Warehouse', label: 'Warehouse' },
    { id: 'Events', label: 'Company Events' },
    { id: 'Customer', label: 'Customer Relations' },
    { id: 'Projects', label: 'Our Projects' }
  ];

  const galleryImages = [
    { 
      key: "about_gallery_1",
      src: getMediaUrl("about_gallery_1", "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"), 
      caption: "New Bharat Corporate Office Lobby", 
      category: "Office" 
    },
    { 
      key: "about_gallery_2",
      src: getMediaUrl("about_gallery_2", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"), 
      caption: "New Bharat Corporate Headquarters Exterior", 
      category: "Office" 
    },
    { 
      key: "about_gallery_3",
      src: getMediaUrl("about_gallery_3", "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"), 
      caption: "Main Distribution & Logistics Warehouse", 
      category: "Warehouse" 
    },
    { 
      key: "about_gallery_4",
      src: getMediaUrl("about_gallery_4", "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop"), 
      caption: "Inventory Management and Power Storage Facility", 
      category: "Warehouse" 
    },
    { 
      key: "about_gallery_5",
      src: getMediaUrl("about_gallery_5", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"), 
      caption: "Our Executive Management and Technical Leads", 
      category: "Team" 
    },
    { 
      key: "about_gallery_6",
      src: getMediaUrl("about_gallery_6", "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop"), 
      caption: "Customer Support & Sales Team", 
      category: "Team" 
    },
    { 
      key: "about_gallery_7",
      src: getMediaUrl("about_gallery_7", "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop"), 
      caption: "Annual Renewable Energy Symposium & Team Celebration", 
      category: "Events" 
    },
    { 
      key: "about_gallery_8",
      src: getMediaUrl("about_gallery_8", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"), 
      caption: "Employee Training & Product Launch Seminar", 
      category: "Events" 
    },
    { 
      key: "about_gallery_9",
      src: getMediaUrl("about_gallery_9", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"), 
      caption: "Client Consultation at Corporate Office", 
      category: "Customer" 
    },
    { 
      key: "about_gallery_10",
      src: getMediaUrl("about_gallery_10", "https://images.unsplash.com/photo-1552581230-c01591d3c99a?q=80&w=800&auto=format&fit=crop"), 
      caption: "Interactive Feedback Session with Local Authorized Dealers", 
      category: "Customer" 
    },
    { 
      key: "about_gallery_11",
      src: getMediaUrl("about_gallery_11", "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop"), 
      caption: "Commercial Rooftop Solar Installation - 50kW Setup", 
      category: "Projects" 
    },
    { 
      key: "about_gallery_12",
      src: getMediaUrl("about_gallery_12", "/images/amaze-an-star-1475-1.jpg"), 
      caption: "Amaze Premium Power Inverter Installation & Brand Showcase", 
      category: "Projects" 
    }
  ];

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" }
  ];

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="About Us, Owner & Core Values"
        description="Discover the story of New Bharat Electricals Budaun. Founded by Mazhar Hussain, we have grown to become Uttar Pradesh's premier certified electrical contractor and Amaze battery distributor."
        keywords="New Bharat history, Mazhar Hussain electrical engineer, Budaun electrical contracting history, certified electricians team"
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Banner */}
      <section className="relative bg-brand-dark py-10 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/80 to-brand-dark z-10" />
          <MediaImage 
            imageKey="about_hero_banner"
            defaultSrc="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop" 
            alt="New Bharat Electricals Facility" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 relative z-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl lg:text-7xl font-heading font-black text-white mb-4 md:mb-6 uppercase tracking-tight drop-shadow-lg"
            style={{ color: '#FFFFFF' }}
          >
            Powering Trust.<br />
            <span className="text-[#84CC16]">Delivering Excellence.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "6rem" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1.5 bg-brand-green mx-auto mb-5 md:mb-8 rounded-full"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#D1D5DB] text-sm md:text-2xl max-w-3xl mx-auto font-semibold tracking-wide drop-shadow-md"
          >
            Your premier destination for high-performance Power Solutions, Solar Energy Systems, and essential Electrical Products.
          </motion.p>
        </div>
      </section>

            {/* Company Story */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
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
              <MediaImage 
                imageKey="about_story_1"
                defaultSrc="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=1000&auto=format&fit=crop" 
                alt="Our Facility" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

            {/* Leadership Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
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
                <MediaImage 
                  imageKey="about_leader_founder"
                  defaultSrc="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=800&auto=format&fit=crop" 
                  alt="Mazhar Hussain - Founder & Owner"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
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
                <MediaImage 
                  imageKey="about_leader_manager"
                  defaultSrc="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" 
                  alt="Sahib Mazhar - Manager"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
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
      <section className="py-12 md:py-16 lg:py-20 bg-brand-dark text-white text-center">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
          <div className="max-w-[800px] mx-auto">
            <Users size={64} className="mx-auto text-[#84CC16] mb-6" />
            <h3 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tight mb-6" style={{ color: '#FFFFFF' }}>
              Our Strength: 50+ Dedicated Professionals
            </h3>
            <p className="text-[#D1D5DB] text-lg md:text-xl font-semibold leading-relaxed">
              Behind every successful product delivery and installation is our formidable team. With over 50 skilled employees working in harmony, we ensure that every client receives personalized attention, prompt service, and expert technical guidance. Our team is the true powerhouse of New Bharat Electricals.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-brand-green">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
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
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
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
      <section className="py-12 md:py-16 lg:py-20 bg-white border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
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
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
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

          {/* Categories Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-4xl mx-auto">
            {galleryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 uppercase tracking-widest cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-brand-green text-white shadow-md shadow-brand-green/25 border-none'
                    : 'bg-white text-gray-800 border border-gray-200 hover:border-brand-green hover:text-brand-green'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Masonry / Grid Gallery */}
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((item) => (
                <motion.div 
                  layout
                  key={item.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group shadow-md hover:shadow-xl hover:border-brand-green border border-gray-100 transition-all"
                  onClick={() => setLightboxImage(getMediaUrl(item.key, item.src))}
                >
                  <MediaImage 
                    imageKey={item.key}
                    defaultSrc={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* High contrast overlay with legible caption text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-brand-lime text-[10px] uppercase font-black tracking-widest mb-1">{item.category}</span>
                    <span className="text-white text-xs sm:text-sm font-extrabold tracking-wide leading-snug drop-shadow-md">
                      {item.caption}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 gap-4"
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-brand-lime transition-colors p-2 z-10"
              onClick={() => setLightboxImage(null)}
              aria-label="Close Lightbox"
            >
              <X size={36} />
            </button>
            <div className="relative max-w-full max-h-[85vh] flex flex-col items-center">
              <motion.img 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={lightboxImage || undefined} 
                alt="Expanded view" 
                className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl border border-gray-800"
                onClick={(e) => e.stopPropagation()}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/images/amaze-an-star-1475-1.jpg') {
                    target.src = '/images/amaze-an-star-1475-1.jpg';
                  }
                }}
              />
              {(() => {
                const item = galleryImages.find(g => g.src === lightboxImage);
                return item?.caption ? (
                  <div 
                    className="mt-4 bg-black/80 px-6 py-2.5 rounded-full border border-gray-800 text-white font-bold tracking-wide text-xs sm:text-sm md:text-base text-center shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.caption}
                  </div>
                ) : null;
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Locations Section */}
      <LocationsPreview />

      {/* CTA Section */}
      <section className="bg-brand-dark py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8 relative z-10">
          <div className="max-w-[1000px] mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight mb-6" style={{ color: '#FFFFFF' }}>
              Ready to Upgrade Your <span className="text-[#84CC16]">Power Solutions?</span>
            </h2>
            <p className="text-[#D1D5DB] text-lg md:text-xl mb-10 max-w-2xl mx-auto font-semibold tracking-wide">
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
        </div>
      </section>
    </div>
  );
}

