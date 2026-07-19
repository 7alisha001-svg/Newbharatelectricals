import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function QuotePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const hasSeenSession = sessionStorage.getItem('quote_popup_seen');
    const lastSeen = localStorage.getItem('quote_popup_last_seen');
    
    let shouldShow = false;
    
    if (!hasSeenSession) {
      if (!lastSeen) {
        shouldShow = true;
      } else {
        const hoursSince = (Date.now() - parseInt(lastSeen)) / (1000 * 60 * 60);
        if (hoursSince > 24) {
          shouldShow = true;
        }
      }
    }

    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000); // 3-5 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('quote_popup_seen', 'true');
    localStorage.setItem('quote_popup_last_seen', Date.now().toString());
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else {
      const cleanPhone = formData.phone.trim().replace(/[\s\-()]/g, '');
      const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
      if (!phoneRegex.test(formData.phone.trim()) || cleanPhone.length < 10) {
        newErrors.phone = 'Enter a valid phone number (minimum 10 digits)';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const payloadData = {
        email: formData.email.trim(),
        message: formData.message.trim(),
        status: 'New',
        is_quote: true
      };
      
      const { error } = await supabase.from('inquiries').insert([{
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        inquiry_type: 'Quote Request',
        message: JSON.stringify(payloadData)
      }]);
      
      if (error) throw error;
      
      const response = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: formData.name.trim(), 
          emailAddress: formData.email.trim(), 
          phoneNumber: formData.phone.trim(), 
          companyName: undefined,
          subject: 'Quote Request', 
          message: formData.message.trim() || 'Please provide a quote for the selected products/services.',
          pageUrl: window.location.href,
          dateTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit quote request.");
      }

      setSubmitted(true);
      
      setTimeout(() => {
        closePopup();
      }, 6000);
      
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      setErrors({ form: err.message || 'There was a problem submitting your request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closePopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="bg-brand-dark px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Get a Free Quote</h2>
                <p className="text-gray-300 text-sm md:text-base leading-snug pr-4">
                  Looking for reliable Solar & Electrical Solutions?<br/>Fill in your details and our experts will contact you shortly.
                </p>
              </div>
              <button 
                onClick={closePopup}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors self-start"
                aria-label="Close popup"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {submitted ? (
                <div className="text-center py-10 px-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
                  <p className="text-base text-gray-700">Thank you for contacting New Bharat Electricals. We have received your enquiry and our team will contact you shortly.</p>
                  <button 
                    onClick={closePopup}
                    className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2.5 px-6 rounded-xl transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.form && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl text-xs font-semibold border border-red-100">
                      {errors.form}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-1 focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-brand-green focus:ring-brand-green'}`}
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                        <input 
                           type="tel" 
                           name="phone" 
                           value={formData.phone} 
                           onChange={handleChange}
                           className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-1 focus:outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-brand-green focus:ring-brand-green'}`}
                           placeholder="9876543210"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-1 focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-brand-green focus:ring-brand-green'}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message / Requirement <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:border-brand-green focus:ring-brand-green focus:outline-none transition-colors resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-brand-green/20 disabled:opacity-70 flex items-center justify-center text-lg"
                    >
                      {loading ? 'Submitting...' : 'Get Free Quote'}
                    </button>
                    <button 
                      type="button" 
                      onClick={closePopup}
                      disabled={loading}
                      className="w-full text-center text-gray-500 hover:text-gray-900 font-medium py-2 transition-colors text-sm"
                    >
                      Maybe Later
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
