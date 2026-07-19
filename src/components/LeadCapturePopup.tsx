import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Mail, MapPin, Tag, Check, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LeadCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [interestedIn, setInterestedIn] = useState('Solar Panel');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if user dismissed or submitted the popup in the last 30 days
    const popupDismissedTime = localStorage.getItem('lead_popup_dismissed_time');
    if (popupDismissedTime) {
      const dismissedAt = parseInt(popupDismissedTime, 10);
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < thirtyDaysMs) {
        return; // Do not show popup
      }
    }

    let timerId: NodeJS.Timeout;
    let hasShown = false;

    const showPopup = () => {
      if (hasShown) return;
      hasShown = true;
      setIsOpen(true);
      // Clean up listeners
      window.removeEventListener('scroll', handleScroll);
    };

    // Trigger 1: Scroll 40% of the page
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollPercent >= 40) {
          showPopup();
        }
      }
    };

    // Trigger 2: Time delay of 10 seconds
    timerId = setTimeout(() => {
      showPopup();
    }, 10000);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Store dismissal time
    localStorage.setItem('lead_popup_dismissed_time', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validations
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    const cleanMobile = mobile.trim().replace(/[\s\-()]/g, '');
    const mobileRegex = /^\+?[0-9\s\-()]{10,}$/;
    if (!mobile.trim() || !mobileRegex.test(mobile.trim()) || cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid phone number (minimum 10 digits).');
      return;
    }
    if (email.trim() && email.trim() !== 'N/A') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
    }
    if (!city.trim()) {
      setErrorMessage('City is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Insert into the Supabase database
      const leadPayload = {
        email: email.trim() || 'N/A',
        city: city.trim(),
        interested_in: interestedIn,
        status: 'New',
        message: 'Lead captured from first-time visitor popup'
      };

      const { error: dbError } = await supabase
        .from('inquiries')
        .insert([{
          name: fullName.trim(),
          phone: mobile.trim(),
          inquiry_type: 'Lead Capture',
          message: JSON.stringify(leadPayload)
        }]);

      if (dbError) throw dbError;

      // 2. Trigger email notification via unified API
      const response = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          emailAddress: email.trim() || 'N/A',
          phoneNumber: mobile.trim(),
          companyName: undefined,
          subject: `Consultation: ${interestedIn}`,
          message: `Product Segment: ${interestedIn}\nPreferred City: ${city.trim()}`,
          pageUrl: window.location.href,
          dateTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to dispatch lead notifications.");
      }

      setIsSuccess(true);
      // Store success in localstorage (30 days exclusion)
      localStorage.setItem('lead_popup_dismissed_time', Date.now().toString());

      // Auto close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 4000);

    } catch (err: any) {
      console.error('Error submitting lead:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full relative border border-gray-100 flex flex-col"
        >
          {/* Top Banner Accent */}
          <div className="h-2 bg-gradient-to-r from-brand-green to-brand-orange w-full" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {!isSuccess ? (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Zap size={24} className="fill-brand-green/10" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-gray-900 leading-tight">
                    Get a Free Solar & Power Consultation
                  </h3>
                  <p className="text-brand-orange text-xs font-bold uppercase tracking-wider mt-1">
                    Expert Guidance • Guaranteed Best Rates
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-6 font-medium leading-relaxed">
                Looking for the right inverter, battery, or solar solution? Leave your details and our team of engineering experts will contact you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold border border-red-100">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name */}
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold"
                  />
                </div>

                {/* Mobile Number */}
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10,}"
                    placeholder="Mobile Number (10+ digits) *"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold"
                  />
                </div>

                {/* Email Address */}
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold"
                  />
                </div>

                {/* City */}
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold"
                  />
                </div>

                {/* Interested In */}
                <div className="relative">
                  <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={interestedIn}
                    onChange={(e) => setInterestedIn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold text-gray-700 cursor-pointer appearance-none"
                  >
                    <option value="Solar Panel">Solar Panel</option>
                    <option value="Solar Inverter">Solar Inverter</option>
                    <option value="Battery">Battery</option>
                    <option value="UPS">UPS</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors text-xs uppercase tracking-wide"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] bg-brand-green hover:bg-brand-orange text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Free Consultation'}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-500 font-semibold">
                <ShieldCheck size={14} className="text-brand-green" />
                <span>Your information is 100% secure & private</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 animate-bounce">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 font-heading">
                Consultation Requested!
              </h3>
              <p className="text-gray-700 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                Thank you, <span className="font-bold text-brand-green">{fullName}</span>. Your request has been logged successfully. Our engineering experts will call you shortly on <span className="font-bold">{mobile}</span>!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
