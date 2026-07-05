import { motion } from 'motion/react';
import { Shield, Zap, Target, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>About Us | New Bharat Electricals</title>
        <meta name="description" content="Learn more about New Bharat Electricals, our mission, vision, and commitment to providing high-quality electrical and solar solutions." />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative bg-brand-dark py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" 
            alt="About Us Background" 
            className="w-full h-full object-cover"
           onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
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
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Powering Every Home & Business with trusted electrical and solar solutions.
          </motion.p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 uppercase tracking-tight">
                Welcome to <span className="text-brand-green">New Bharat Electricals</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                New Bharat Electricals is a leading provider of comprehensive electrical and solar solutions. With years of industry experience, we are dedicated to delivering high-quality products that meet the diverse needs of our residential, commercial, and industrial clients.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our extensive product range includes premium inverters, durable batteries, advanced solar panels, and essential electrical accessories. We partner with top brands and manufacturers to ensure that every product we offer stands for reliability, efficiency, and longevity.
              </p>
              <div className="pt-4">
                <Link to="/contact" className="inline-block bg-brand-dark text-white font-bold px-8 py-4 rounded hover:bg-brand-green transition-colors uppercase tracking-widest text-sm">
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
               onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-[#f8f9fa] border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-green transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <Target size={48} className="text-brand-green mb-6" />
              <h3 className="text-2xl font-heading font-bold text-gray-900 uppercase tracking-tight mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
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
              <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-tight mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                To be the most trusted and preferred partner for all electrical and solar energy needs across the nation, recognized for our commitment to quality, technological advancement, and customer satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 uppercase tracking-tight mb-4">
              Why Choose Us
            </h2>
            <div className="w-16 h-1 bg-brand-green mx-auto mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
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
                className="text-center p-8 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="w-20 h-20 mx-auto bg-brand-green/10 rounded-full flex items-center justify-center mb-6 text-brand-green">
                  <feature.icon size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-green py-16">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tight mb-6">
            Ready to Upgrade Your Power Solutions?
          </h2>
          <p className="text-brand-dark/80 text-lg mb-8 max-w-2xl mx-auto font-medium">
            Explore our extensive catalog or get in touch with our experts to find the perfect electrical or solar setup for your requirements.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalogue" className="bg-brand-dark text-white font-bold px-8 py-4 rounded hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl">
              View Catalog
            </Link>
            <Link to="/contact" className="bg-white text-brand-dark font-bold px-8 py-4 rounded hover:bg-gray-100 transition-colors uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
