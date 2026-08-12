import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Mail, MessageSquare, Package, CheckCircle2, AlertCircle, ShieldCheck, Send } from 'lucide-react';
import { supabaseAnon } from '../lib/supabase';

interface ProductEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    sku: string;
  };
}

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

export default function ProductEnquiryModal({ isOpen, onClose, product }: ProductEnquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Load reCAPTCHA script
  useEffect(() => {
    if (RECAPTCHA_SITE_KEY && !document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    window.onRecaptchaLoad = () => {
      setRecaptchaLoaded(true);
    };

    return () => {
      // Clean up
      if (window.grecaptcha && recaptchaRef.current) {
        try {
          window.grecaptcha.reset();
        } catch (e) {
          // Ignore reset errors
        }
      }
    };
  }, []);

  // Render reCAPTCHA when modal opens
  useEffect(() => {
    if (isOpen && recaptchaLoaded && RECAPTCHA_SITE_KEY && recaptchaRef.current) {
      try {
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: 'light',
          size: 'normal',
          callback: (token: string) => {
            setRecaptchaToken(token);
          },
          'expired-callback': () => {
            setRecaptchaToken(null);
          },
        });
      } catch (e) {
        // Already rendered, try to reset
        try {
          window.grecaptcha.reset();
        } catch (err) {
          // Ignore
        }
      }
    }
  }, [isOpen, recaptchaLoaded]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsSuccess(false);
      setErrorMessage('');
      setRecaptchaToken(null);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validateForm = (): string | null => {
    if (!fullName.trim()) {
      return 'Please enter your full name.';
    }

    const cleanPhone = phone.trim().replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return 'Please enter a valid Indian phone number (10 digits).';
    }

    if (!email.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (!recaptchaToken && RECAPTCHA_SITE_KEY) {
      return 'Please complete the reCAPTCHA verification.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Insert into Supabase inquiries table
      const payloadData = {
        product_name: product.name,
        product_sku: product.sku,
        product_id: product.id,
        email: email.trim(),
        status: 'New',
        is_product_enquiry: true,
        message: message.trim() || ''
      };

      const { data: insertedData, error: dbError } = await supabaseAnon
        .from('inquiries')
        .insert([{
          name: fullName.trim(),
          phone: phone.trim(),
          inquiry_type: 'Product Enquiry',
          message: JSON.stringify(payloadData)
        }])
        .select();

      if (dbError) throw dbError;

      // 2. Send email notification via server API
      const response = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: insertedData?.[0]?.id,
          fullName: fullName.trim(),
          emailAddress: email.trim(),
          phoneNumber: phone.trim(),
          companyName: undefined,
          subject: `Product Enquiry: ${product.name}`,
          message: message.trim() || 'No additional message provided.',
          pageUrl: window.location.href,
          dateTime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          source: 'Product Page',
          productName: product.name,
          productSku: product.sku,
          productId: product.id,
          recaptchaToken: recaptchaToken || undefined
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit enquiry.");
      }

      setIsSuccess(true);

      // Auto close after 4 seconds
      setTimeout(() => {
        onClose();
      }, 4000);

    } catch (err: any) {
      console.error('Error submitting product enquiry:', err);
      setErrorMessage('We could not submit your enquiry right now. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full relative border border-gray-100 flex flex-col max-h-[90vh]"
          >
            {/* Top Banner Accent */}
            <div className="h-2 bg-gradient-to-r from-brand-green to-brand-orange w-full flex-shrink-0" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-all z-10"
              aria-label="Close enquiry form"
            >
              <X size={20} />
            </button>

            {!isSuccess ? (
              <div className="p-5 sm:p-8 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-gray-900 leading-tight">
                      Product Enquiry
                    </h3>
                    <p className="text-brand-orange text-xs font-bold uppercase tracking-wider mt-1">
                      Get Expert Assistance
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-5 font-medium leading-relaxed">
                  Fill in your details below and our team will contact you shortly with pricing, availability and specifications.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold border border-red-100">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Product Name (Read-only) */}
                  <div className="relative">
                    <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" />
                    <input
                      type="text"
                      readOnly
                      value={product.name}
                      className="w-full bg-brand-green-light/50 border border-brand-green/30 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-brand-green focus:outline-none cursor-default"
                      aria-label="Product Name"
                    />
                  </div>

                  {/* SKU (Read-only) */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">SKU</span>
                    <input
                      type="text"
                      readOnly
                      value={product.sku}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-14 pr-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none cursor-default"
                      aria-label="Product SKU"
                    />
                  </div>

                  {/* Name */}
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (10 digits) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold"
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-4 top-3 text-gray-400" />
                    <textarea
                      rows={3}
                      placeholder="Type your message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all font-semibold resize-none"
                    />
                  </div>

                  {/* reCAPTCHA */}
                  {RECAPTCHA_SITE_KEY ? (
                    <div className="flex justify-center">
                      <div ref={recaptchaRef} className="g-recaptcha" />
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
                      reCAPTCHA is not configured. Please set VITE_RECAPTCHA_SITE_KEY.
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-green hover:bg-brand-orange text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-500 font-semibold">
                  <ShieldCheck size={14} className="text-brand-green" />
                  <span>Your information is 100% secure & private</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle2 size={32} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 font-heading">
                  Enquiry Submitted!
                </h3>
                <p className="text-gray-700 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                  Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}