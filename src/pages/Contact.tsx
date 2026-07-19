import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Building, Warehouse } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useStore } from '../context/StoreContext';
import { SEO } from '../components/SEO';
import { trackLeadSubmission } from '../lib/analytics';

export default function Contact() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const company = (form.elements.namedItem('company') as HTMLInputElement).value.trim();
    const inquiryType = (form.elements.namedItem('inquiry-type') as HTMLSelectElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();

    // Validations
    if (!name) {
      setError("Full name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!phone) {
      setError("Phone number is required.");
      setIsSubmitting(false);
      return;
    }
    // Standard phone validation
    const phoneClean = phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
    if (!phoneRegex.test(phone) || phoneClean.length < 10) {
      setError("Please enter a valid phone number (minimum 10 digits).");
      setIsSubmitting(false);
      return;
    }
    if (!email) {
      setError("Email address is required.");
      setIsSubmitting(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payloadData = {
        email,
        company,
        status: 'New',
        is_contact: true,
        message: message
      };

      const { error: dbError } = await supabase
        .from('inquiries')
        .insert([{ 
          name, 
          phone, 
          inquiry_type: inquiryType, 
          message: JSON.stringify(payloadData)
        }]);

      if (dbError) throw dbError;

      const response = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          emailAddress: email,
          phoneNumber: phone,
          companyName: company || undefined,
          subject: inquiryType,
          message: message,
          pageUrl: window.location.href,
          dateTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to deliver email.");
      }

      setSubmitted(true);
      trackLeadSubmission('Contact Form', inquiryType);
      form.reset();
      setTimeout(() => setSubmitted(false), 10000);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setError(err.message || 'There was a problem submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" }
  ];

  const contactFaqs = [
    {
      question: "What are your business hours?",
      answer: "We are open Monday to Saturday from 09:00 AM to 08:00 PM."
    },
    {
      question: "How do I request a site inspection or service call?",
      answer: "You can submit the contact form, click our WhatsApp floating button, or call our certified technical support directly."
    }
  ];

  return (
    <>
      <SEO 
        title="Contact Us & Request a Callback"
        description="Connect with the certified engineering team at New Bharat Electricals Budaun. Inquire about Class-A contracting, solar plans, AMCs, or request an emergency service call."
        keywords="electrical contractor helpline, solar panel quotes, Amaze batteries inquiry, Class-A contractor license Budaun"
        breadcrumbs={breadcrumbs}
        faqData={contactFaqs}
      />
      <div className="w-full bg-white">
        {/* Header */}
        <section className="bg-brand-dark py-10 md:py-16 text-center px-4 md:px-6">
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
            className="text-lg md:text-xl text-gray-900 max-w-2xl mx-auto"
          >
            Have questions about our products, dealer opportunities, or require support? We are here to help.
          </motion.p>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 md:py-16">
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
                  <p className="text-gray-900">Thank you for contacting New Bharat Electricals. We have received your enquiry and our team will contact you shortly.</p>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input id="name" name="name" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                      <input id="phone" name="phone" required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="+91 94570 02000" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                      <input id="email" name="email" required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="name@domain.com" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-bold text-gray-700 mb-2">Company Name <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                      <input id="company" name="company" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="Your Company Name" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiry-type" className="block text-sm font-bold text-gray-700 mb-2">Product Inquiry</label>
                    <select id="inquiry-type" name="inquiry-type" required defaultValue="" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-gray-700">
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
                    <textarea id="message" name="message" required rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all" placeholder="Tell us how we can help you..."></textarea>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-brand-green text-white font-bold py-4 px-8 rounded-2xl hover:bg-brand-green-dark transition-colors flex items-center justify-center shadow-lg shadow-brand-green/30 disabled:opacity-70">
                      {isSubmitting ? 'Sending...' : 'Send Inquiry'} {!isSubmitting && <Send size={18} className="ml-2" />}
                    </button>
                    <a href="https://wa.me/919457002000" target="_blank" rel="noreferrer" className="sm:flex-1 bg-white border-2 border-[#25D366] text-[#25D366] font-bold py-4 px-8 rounded-2xl hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-center">
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
                    <p className="text-gray-700 mb-1">Mon-Sat, 9am to 8pm</p>
                    <a href="tel:+919457002000" className="text-brand-green font-bold text-xl hover:text-brand-green-dark transition-colors">+91 94570 02000</a>
                  </div>
                </div>

                <div className="flex">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-brand-green mr-5 h-min">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Email Support</p>
                    <p className="text-gray-700 mb-1">24/7 Priority Support</p>
                    <a href="mailto:info@newbharatelectricals.com" className="text-brand-green font-medium hover:text-brand-green-dark transition-colors">info@newbharatelectricals.com</a>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-white p-6 rounded-2xl border border-brand-green/20">
                <h4 className="font-bold text-gray-900 mb-2">Dealer Partnership</h4>
                <p className="text-gray-900 text-sm mb-4">Interested in becoming a certified New Bharat Electricals distributor?</p>
                <button className="text-brand-green font-bold text-sm uppercase tracking-wider hover:text-brand-green-dark transition-colors flex items-center">
                  Learn More <Send size={14} className="ml-1" />
                </button>
              </div>
            </motion.div>

          </div>
        </section>

      {/* Our Locations Section */}
      <section className="py-10 md:py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 uppercase tracking-tight mb-4">
              Our Locations
            </h2>
            <div className="w-16 h-1 bg-brand-green mx-auto mb-6" />
            <p className="text-gray-900 max-w-2xl mx-auto text-lg">
              Visit our corporate office or warehouse.
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Corporate Office</h3>
                <h4 className="text-brand-green font-semibold mb-4">{settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.business_name || settings?.business_name || 'New Bharat Electricals'}</h4>
                
                <div className="flex items-start text-gray-900 mb-4 gap-3">
                  <MapPin size={20} className="mt-1 flex-shrink-0 text-gray-900" />
                  <p className="leading-relaxed whitespace-pre-line">
                    {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.address || 
                     settings?.office_address || 
                     'Near Dr Amar Singh,\nChaudhry Sarai,\nLalpul Road,\nBudaun HO,\nBudaun – 243601,\nUttar Pradesh'}
                  </p>
                </div>
                
                {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.phone && (
                  <div className="flex items-center text-gray-900 gap-3 mb-4">
                    <Phone size={20} className="flex-shrink-0 text-gray-900" />
                    <a href={`tel:${settings.social_links.locations.find((l: any) => l.type === 'office').phone}`} className="hover:text-brand-green transition-colors">
                      {settings.social_links.locations.find((l: any) => l.type === 'office').phone}
                    </a>
                  </div>
                )}

                {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.business_hours && (
                  <div className="flex items-center text-gray-900 gap-3 mb-6">
                    <div className="flex items-center">
                      <span className="font-bold text-sm">Hours:</span>
                      <span className="ml-2">{settings.social_links.locations.find((l: any) => l.type === 'office').business_hours}</span>
                    </div>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Warehouse</h3>
                <h4 className="text-gray-700 font-semibold mb-4">Distribution & Logistics</h4>
                
                <div className="flex items-start text-gray-900 mb-4 gap-3">
                  <MapPin size={20} className="mt-1 flex-shrink-0 text-gray-900" />
                  <p className="leading-relaxed whitespace-pre-line">
                    {settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.address || 
                     settings?.warehouse_address || 
                     'Budaun,\nLoda Bahedi,\nUttar Pradesh – 243601'}
                  </p>
                </div>

                {settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.phone && (
                  <div className="flex items-center text-gray-900 gap-3 mb-4">
                    <Phone size={20} className="flex-shrink-0 text-gray-900" />
                    <a href={`tel:${settings.social_links.locations.find((l: any) => l.type === 'warehouse').phone}`} className="hover:text-brand-green transition-colors">
                      {settings.social_links.locations.find((l: any) => l.type === 'warehouse').phone}
                    </a>
                  </div>
                )}

                {settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.business_hours && (
                  <div className="flex items-center text-gray-900 gap-3 mb-6">
                    <div className="flex items-center">
                      <span className="font-bold text-sm">Hours:</span>
                      <span className="ml-2">{settings.social_links.locations.find((l: any) => l.type === 'warehouse').business_hours}</span>
                    </div>
                  </div>
                )}
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
      </div>
    </>
  );
}
