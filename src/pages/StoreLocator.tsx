import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle, Navigation, Clock } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function StoreLocator() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Store Locator", url: "/store-locator" }
  ];

  return (
    <>
      <SEO 
        title="Store Locator & Head Office Directions"
        description="Find our authorized dealer hubs, showrooms, and the flagship New Bharat Electricals store located in Budaun, Uttar Pradesh. View Google Maps coordinates, opening schedules, and calling numbers."
        keywords="New Bharat Electricals shop location, electrical store Budaun, inverter showroom Uttar Pradesh, solar panel dealer contact"
        breadcrumbs={breadcrumbs}
      />
      <div className="w-full min-h-[80vh] bg-white">
        {/* Header */}
        <section className="bg-brand-gray py-8 md:py-20 border-b border-gray-200 text-center px-4">
          <h1 className="text-2xl md:text-5xl font-heading font-bold text-gray-900 mb-3 md:mb-4">Store Locator</h1>
          <p className="text-gray-900 font-medium max-w-xl mx-auto text-sm md:text-base">Find our authorized dealer and flagship store in Budaun, Uttar Pradesh.</p>
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Info Box */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-5 sm:p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="inline-flex items-center text-xs font-bold tracking-widest uppercase bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full mb-4 md:mb-6">
              Head Office & Showroom
            </div>
            
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-5 md:mb-8">New Bharat Electricals</h2>
            
            <ul className="space-y-4 md:space-y-6 mb-8 md:mb-12">
              <li className="flex items-start">
                <MapPin className="text-brand-green mt-1 mr-3 md:mr-4 flex-shrink-0" size={20} />
                <div>
                  <p className="font-bold text-gray-900">Address</p>
                  <p className="text-gray-900 font-medium mt-1 text-sm md:text-base">Near Dr Amar Singh,<br />Chaudhary Saray Lalpul Road,<br />Budaun HO, Budaun 243601,<br />Uttar Pradesh</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Clock className="text-brand-green mt-1 mr-3 md:mr-4 flex-shrink-0" size={20} />
                <div>
                  <p className="font-bold text-gray-900">Working Hours</p>
                  <p className="text-gray-900 font-medium mt-1 text-sm md:text-base">Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: Closed</p>
                </div>
              </li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <a href="tel:+919457002000" className="flex items-center justify-center bg-gray-900 text-white py-3 px-6 rounded-xl md:rounded-2xl font-bold hover:bg-gray-800 transition-colors">
                <Phone size={18} className="mr-2" /> Call Now
              </a>
              <a href="https://wa.me/919457002000" target="_blank" rel="noreferrer" className="flex items-center justify-center bg-[#25D366] text-white py-3 px-6 rounded-xl md:rounded-2xl font-bold hover:bg-[#20bd5a] transition-colors">
                <MessageCircle size={18} className="mr-2" /> WhatsApp
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Budaun+Uttar+Pradesh" target="_blank" rel="noreferrer" className="sm:col-span-2 flex items-center justify-center bg-white border-2 border-brand-green text-brand-green py-3 px-6 rounded-xl md:rounded-2xl font-bold hover:bg-brand-green hover:text-white transition-colors">
                <Navigation size={18} className="mr-2" /> Get Directions
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-brand-gray rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative min-h-[400px]"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.627685651664!2d79.1171802!3d28.0384814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399fbf2555555555%3A0x1111111111111111!2sBudaun%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714567890123!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '400px' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="New Bharat Electricals Location Map"
            ></iframe>
          </motion.div>
        </section>
      </div>
    </>
  );
}
