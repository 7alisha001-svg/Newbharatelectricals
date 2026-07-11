import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

import { supabase } from '../lib/supabase';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const inquiryType = (form.elements.namedItem('inquiry-type') as HTMLSelectElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    try {
      const { error: dbError } = await supabase
        .from('inquiries')
        .insert([{ 
          name, 
          phone, 
          inquiry_type: inquiryType, 
          message 
        }]);

      if (dbError) throw dbError;

      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setError('There was a problem submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | New Bharat Electricals | Budaun</title>
        <meta name="description" content="Get in touch with New Bharat Electricals for inquiries about solar panels, inverters, and electrical accessories in Budaun, India." />
      </Helmet>
      <div className="w-full bg-white">
        {/* Header */}
        <section className="bg-brand-dark py-12 md:py-24 text-center px-4 md:px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 md:mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Have questions about our products, dealer opportunities, or require support? We are here to help.
          </motion.p>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">Send an Inquiry</h2>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]"
                >
                  <CheckCircle2 size={64} className="text-brand-green mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600">Thank you for reaching out. Our team will get back to you shortly.</p>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input id="name" name="name" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input id="phone" name="phone" required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="+91 90000 00000" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiry-type" className="block text-sm font-bold text-gray-700 mb-2">Product Inquiry</label>
                    <select id="inquiry-type" name="inquiry-type" required defaultValue="" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-gray-700">
                      <option value="" disabled>Select a category...</option>
                      <option value="Power Solutions (Inverters/UPS)">Power Solutions (Inverters/UPS)</option>
                      <option value="Solar Solutions">Solar Solutions</option>
                      <option value="Mobility & EV Batteries">Mobility & EV Batteries</option>
                      <option value="Electrical Accessories">Electrical Accessories</option>
                      <option value="Dealer Partnership">Dealer Partnership</option>
                      <option value="Other / Support">Other / Support</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                    <textarea id="message" name="message" required rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="Tell us how we can help you..."></textarea>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-brand-green text-white font-bold py-4 px-8 rounded-lg hover:bg-brand-green-dark transition-colors flex items-center justify-center shadow-lg shadow-brand-green/30 disabled:opacity-70">
                      {isSubmitting ? 'Sending...' : 'Send Inquiry'} {!isSubmitting && <Send size={18} className="ml-2" />}
                    </button>
                    <a href="https://wa.me/919457002000" target="_blank" rel="noreferrer" className="sm:flex-1 bg-white border-2 border-[#25D366] text-[#25D366] font-bold py-4 px-8 rounded-lg hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-center">
                      <MessageCircle size={18} className="mr-2" /> Quick WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 bg-brand-gray p-6 sm:p-8 md:p-12 rounded-3xl"
            >
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-8">Reach Out Directly</h3>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-brand-green mr-5 h-min">
                    <Phone size={24} />
                  </div>
                   <div>
                    <p className="font-bold text-gray-900 text-lg">Call Us</p>
                    <p className="text-gray-500 mb-1">Mon-Sat, 9am to 8pm</p>
                    <a href="tel:+919457002000" className="text-brand-green font-bold text-xl hover:text-brand-green-dark transition-colors">+91 94570 02000</a>
                  </div>
                </div>

                <div className="flex">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-brand-green mr-5 h-min">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Email Support</p>
                    <p className="text-gray-500 mb-1">24/7 Priority Support</p>
                    <a href="mailto:newbharatelectricals00@gmail.com" className="text-brand-green font-medium hover:text-brand-green-dark transition-colors">newbharatelectricals00@gmail.com</a>
                  </div>
                </div>

                <div className="flex">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-brand-green mr-5 h-min">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Office Location</p>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      Near Dr Amar Singh,<br />
                      Chaudhary Saray Lalpul Road,<br />
                      Budaun HO, Budaun 243601,<br />
                      Uttar Pradesh
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-brand-green mr-5 h-min">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Warehouse Location</p>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      Near Dr Amar Singh,<br />
                      Chaudhary Saray Lalpul Road,<br />
                      Budaun HO, Budaun 243601,<br />
                      Uttar Pradesh
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-white p-6 rounded-2xl border border-brand-green/20">
                <h4 className="font-bold text-gray-900 mb-2">Dealer Partnership</h4>
                <p className="text-gray-600 text-sm mb-4">Interested in becoming a certified New Bharat Electricals distributor?</p>
                <button className="text-brand-green font-bold text-sm uppercase tracking-wider hover:text-brand-green-dark transition-colors flex items-center">
                  Learn More <Send size={14} className="ml-1" />
                </button>
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </>
  );
}
