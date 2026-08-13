import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Building,
  Building2,
  Warehouse,
} from 'lucide-react';

import { supabaseAnon } from '../lib/supabase';
import { useStore } from '../context/StoreContext';
import { SEO } from '../components/SEO';
import { trackLeadSubmission } from '../lib/analytics';
import MediaImage from '../components/MediaImage';

interface LocationCardProps {
  icon: React.ReactNode;
  title: string;
  companyName: string;
  address: string;
  mapUrl: string;
  openMapsUrl: string;
}

function LocationCard({
  icon,
  title,
  companyName,
  address,
  mapUrl,
  openMapsUrl,
}: LocationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-md sm:p-8"
    >
      {/* Icon */}
      <div className="mb-4 flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-brand-green/10">
        {icon}
      </div>

      {/* Location Information */}
      <div className="flex flex-1 flex-col">

        {/* Title */}
        <h3 className="mb-2 min-h-[30px] text-xl sm:min-h-[36px] sm:text-2xl font-black text-gray-900">
          {title}
        </h3>

        {/* Company Name */}
        <p className="mb-2 min-h-[20px] text-sm sm:min-h-[24px] sm:text-base font-semibold tracking-wide text-brand-green">
          {companyName}
        </p>

        {/* Address */}
        <p className="mb-3 min-h-[100px] text-sm sm:mb-4 sm:min-h-[128px] sm:text-lg font-medium leading-relaxed tracking-wide text-gray-900 whitespace-pre-line">
          {address}
        </p>

        {/* Google Map */}
        <div className="mt-auto overflow-hidden rounded-xl border border-gray-200">
          <iframe
            src={mapUrl}
            title={`${title} map`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-40 sm:h-48 w-full border-0"
          />
        </div>

        {/* Open in Maps */}
        <a
          href={openMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 sm:mt-4 inline-flex h-12 sm:h-14 items-center justify-center rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2.5 font-bold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
        >
          Open in Maps
          <MapPin size={16} className="ml-2" />
        </a>
      </div>
    </motion.article>
  );
}

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

    const name = (
      form.elements.namedItem('name') as HTMLInputElement
    ).value.trim();

    const phone = (
      form.elements.namedItem('phone') as HTMLInputElement
    ).value.trim();

    const email = (
      form.elements.namedItem('email') as HTMLInputElement
    ).value.trim();

    const company = (
      form.elements.namedItem('company') as HTMLInputElement
    ).value.trim();

    const inquiryType = (
      form.elements.namedItem('inquiry-type') as HTMLSelectElement
    ).value;

    const message = (
      form.elements.namedItem('message') as HTMLTextAreaElement
    ).value.trim();

    if (!name) {
      setError('Full name is required.');
      setIsSubmitting(false);
      return;
    }

    if (!phone) {
      setError('Phone number is required.');
      setIsSubmitting(false);
      return;
    }

    const phoneClean = phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;

    if (!phoneRegex.test(phone) || phoneClean.length < 10) {
      setError(
        'Please enter a valid phone number (minimum 10 digits).'
      );
      setIsSubmitting(false);
      return;
    }

    if (!email) {
      setError('Email address is required.');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payloadData = {
        email,
        company,
        status: 'New',
        is_contact: true,
        message,
      };

      const { data: insertedData, error: dbError } =
        await supabaseAnon
          .from('inquiries')
          .insert([
            {
              name,
              phone,
              inquiry_type: inquiryType,
              message: JSON.stringify(payloadData),
            },
          ])
          .select();

      if (dbError) throw dbError;

      const response = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: insertedData?.[0]?.id,
          fullName: name,
          emailAddress: email,
          phoneNumber: phone,
          companyName: company || undefined,
          subject: inquiryType,
          message,
          pageUrl: window.location.href,
          dateTime: new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }),
          source: 'Contact Page',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'Failed to deliver email.'
        );
      }

      setSubmitted(true);
      trackLeadSubmission('Contact Form', inquiryType);

      form.reset();

      setTimeout(() => {
        setSubmitted(false);
      }, 10000);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);

      setError(
        err.message ||
          'There was a problem submitting your inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
  ];

  const contactFaqs = [
    {
      question: 'What are your business hours?',
      answer:
        'We are open Monday to Saturday from 09:00 AM to 08:00 PM.',
    },
    {
      question:
        'How do I request a site inspection or service call?',
      answer:
        'You can submit the contact form, click our WhatsApp floating button, or call our certified technical support directly.',
    },
  ];

  /*
   * EXACT SAME 3 LOCATIONS AS HOME PAGE
   */
  const locations: LocationCardProps[] = [
    {
      title: 'Head Office',
      companyName: 'NEW BHARAT ELECTRICALS',
      address:
        'Near Dr Amar Singh,\nChaudhary Saray Lalpul Road,\nBudaun HO, Budaun – 243601,\nUttar Pradesh, India',
      mapUrl:
        'https://www.google.com/maps?q=Near+Dr+Amar+Singh,+Chaudhary+Saray+Lalpul+Road,+Budaun+243601,+Uttar+Pradesh,+India&output=embed',
      openMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Near+Dr+Amar+Singh,+Chaudhary+Saray+Lalpul+Road,+Budaun+243601,+Uttar+Pradesh,+India',
      icon: (
        <Building
          size={34}
          className="text-brand-green"
        />
      ),
    },

    {
      title: 'Branch Office',
      companyName: 'NEW BHARAT ELECTRICALS',
      address:
        'Kargaina Market,\nOpp. Bharat Motors,\nChaupla Road,\nBareilly - 243001,\nUttar Pradesh, India',
      mapUrl:
        'https://www.google.com/maps?q=Kargaina+Market%2C+Opp.+Bharat+Motors%2C+Chaupla+Road%2C+Bareilly+243001%2C+Uttar+Pradesh%2C+India&output=embed',
      openMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Kargaina+Market%2C+Opp.+Bharat+Motors%2C+Chaupla+Road%2C+Bareilly+243001%2C+Uttar+Pradesh%2C+India',
      icon: (
        <Building2
          size={34}
          className="text-brand-green"
        />
      ),
    },

    {
      title: 'Warehouse',
      companyName: 'NEW BHARAT ELECTRICALS',
      address:
        'New Bharat Electricals\nNational Highway 530B\nOpp. Florence Nightingale\nUjhani Road\nBadaun – 243601\nUttar Pradesh',
      mapUrl:
        'https://www.google.com/maps?q=New+Bharat+Electricals,+National+Highway+530B,+Opp.+Florence+Nightingale,+Ujhani+Road,+Badaun+243601,+Uttar+Pradesh,+India&output=embed',
      openMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=New+Bharat+Electricals,+National+Highway+530B,+Opp.+Florence+Nightingale,+Ujhani+Road,+Badaun+243601,+Uttar+Pradesh,+India',
      icon: (
        <Warehouse
          size={34}
          className="text-brand-green"
        />
      ),
    },
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

        {/* ================= HEADER ================= */}
        <section className="bg-brand-dark py-8 md:py-16 text-center px-4 md:px-6 relative overflow-hidden">

          <div className="absolute inset-0 opacity-20">
            <MediaImage
              imageKey="contact_hero_banner"
              defaultSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
              alt="Contact Us Header Background"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-5xl font-heading font-bold text-white mb-3 md:mb-6"
              style={{ color: '#FFFFFF' }}
            >
              Contact Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-xl text-[#D1D5DB] max-w-2xl mx-auto font-medium"
            >
              Have questions about our products, dealer opportunities,
              or require support? We are here to help.
            </motion.p>

          </div>
        </section>

        {/* ================= CONTACT FORM + SIDEBAR ================= */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-16">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-16">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 bg-white p-5 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 relative"
            >

              <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-5 md:mb-8">
                Send an Inquiry
              </h2>

              {submitted ? (

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]"
                >

                  <CheckCircle2
                    size={64}
                    className="text-brand-green mb-4"
                  />

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>

                  <p className="text-gray-900">
                    Thank you for contacting New Bharat Electricals.
                    We have received your enquiry and our team will
                    contact you shortly.
                  </p>

                </motion.div>

              ) : (

                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit}
                >

                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-bold text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>

                      <input
                        id="name"
                        name="name"
                        required
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-bold text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        required
                        type="tel"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        placeholder="+91 94570 02000"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-bold text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>

                      <input
                        id="email"
                        name="email"
                        required
                        type="email"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        placeholder="name@domain.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-bold text-gray-700 mb-2"
                      >
                        Company Name{' '}
                        <span className="text-gray-400 font-normal text-xs ml-1">
                          (Optional)
                        </span>
                      </label>

                      <input
                        id="company"
                        name="company"
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        placeholder="Your Company Name"
                      />
                    </div>

                  </div>

                  <div>

                    <label
                      htmlFor="inquiry-type"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Product Inquiry
                    </label>

                    <select
                      id="inquiry-type"
                      name="inquiry-type"
                      required
                      defaultValue=""
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-gray-700"
                    >

                      <option value="" disabled>
                        Select a category...
                      </option>

                      <option value="Power Solutions (Inverters/UPS)">
                        Power Solutions (Inverters/UPS)
                      </option>

                      <option value="Solar Solutions">
                        Solar Solutions
                      </option>

                      <option value="Mobility & EV Batteries">
                        Mobility & EV Batteries
                      </option>

                      <option value="Electrical Accessories">
                        Electrical Accessories
                      </option>

                      <option value="Dealer Partnership">
                        Dealer Partnership
                      </option>

                      <option value="Other / Support">
                        Other / Support
                      </option>

                    </select>

                  </div>

                  <div>

                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                      placeholder="Tell us how we can help you..."
                    />

                  </div>

                  <div className="pt-3 md:pt-4 flex flex-col sm:flex-row gap-3 md:gap-4">

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-brand-green text-white font-bold py-3.5 md:py-4 px-8 rounded-xl md:rounded-2xl hover:bg-brand-green-dark transition-colors flex items-center justify-center shadow-lg shadow-brand-green/30 disabled:opacity-70"
                    >
                      {isSubmitting
                        ? 'Sending...'
                        : 'Send Inquiry'}

                      {!isSubmitting && (
                        <Send size={18} className="ml-2" />
                      )}
                    </button>

                    <a
                      href="https://wa.me/919457002000"
                      target="_blank"
                      rel="noreferrer"
                      className="sm:flex-1 bg-white border-2 border-[#25D366] text-[#25D366] font-bold py-3.5 md:py-4 px-8 rounded-xl md:rounded-2xl hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-center"
                    >
                      <MessageCircle
                        size={18}
                        className="mr-2"
                      />

                      Quick WhatsApp
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

              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-8">
                Reach Out Directly
              </h3>

              <div className="space-y-8">

                {/* Phone */}
                <div className="flex">

                  <div className="bg-white p-3 rounded-xl shadow-sm text-brand-green mr-5 h-min">
                    <Phone size={24} />
                  </div>

                  <div>

                    <p className="font-bold text-gray-900 text-lg">
                      Call Us
                    </p>

                    <p className="text-gray-700 mb-1">
                      Mon-Sat, 9am to 8pm
                    </p>

                    <a
                      href="tel:+919457002000"
                      className="text-brand-green font-bold text-xl hover:text-brand-green-dark transition-colors"
                    >
                      +91 94570 02000
                    </a>

                  </div>

                </div>

                {/* Email */}
                <div className="flex">

                  <div className="bg-white p-3 rounded-xl shadow-sm text-brand-green mr-5 h-min">
                    <Mail size={24} />
                  </div>

                  <div>

                    <p className="font-bold text-gray-900 text-lg">
                      Email Support
                    </p>

                    <p className="text-gray-700 mb-1">
                      24/7 Priority Support
                    </p>

                    <a
                      href="mailto:info@newbharatelectricals.com"
                      className="text-brand-green font-medium hover:text-brand-green-dark transition-colors"
                    >
                      info@newbharatelectricals.com
                    </a>

                  </div>

                </div>

              </div>

              {/* Dealer Partnership */}
              <div className="mt-12 bg-white p-6 rounded-2xl border border-brand-green/20">

                <h4 className="font-bold text-gray-900 mb-2">
                  Dealer Partnership
                </h4>

                <p className="text-gray-900 text-sm mb-4">
                  Interested in becoming a certified New Bharat
                  Electricals distributor?
                </p>

                <a
  href="https://wa.me/919457002000?text=Hello%20New%20Bharat%20Electricals,%20I%20am%20interested%20in%20becoming%20a%20dealer%20partner.%20Please%20share%20the%20dealer%20partnership%20details%20and%20requirements."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center bg-brand-green text-white font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-md"
>
  Dealer Partnership
  <MessageCircle size={16} className="ml-2" />
</a>

              </div>

            </motion.div>

          </div>
        </section>

        {/* ================= OUR LOCATIONS ================= */}
        <section className="bg-white py-8 md:py-16">

          <div className="mx-auto max-w-[1600px] px-4 lg:px-8">

            {/* Section Heading */}
            <div className="mb-6 md:mb-10 text-center">

              <h2 className="text-2xl md:text-4xl font-black text-gray-900">
                Our Locations
              </h2>

              <p className="mt-1 md:mt-2 text-sm md:text-base font-medium text-gray-600">
                Visit our offices and service points
              </p>

            </div>

            {/* EXACT SAME 3 LOCATION CARDS AS HOME PAGE */}
            <div className="grid items-stretch gap-3 md:gap-6 lg:grid-cols-3">

              {locations.map((location) => (
                <LocationCard
                  key={location.title}
                  {...location}
                />
              ))}

            </div>

          </div>

        </section>

      </div>
    </>
  );
}