import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { mainNavLinks as fallbackNavLinks } from '../data/navigation';

export default function Footer() {
  const { settings } = useStore();
  const mainNavLinks = settings?.social_links?.navigation || fallbackNavLinks;
  return (
    <footer className="bg-brand-dark pt-6 sm:pt-8 relative text-sm border-t-4 border-brand-green">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        
        {/* Social Bar & Partner Call */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-3 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-center mb-3 md:mb-0 text-center sm:text-left">
               <span className="text-white font-heading font-bold text-lg mb-2 sm:mb-0 sm:mr-4 tracking-tight">Connect With Us</span>
               <div className="flex gap-2">
                 <a href="https://www.facebook.com/newbharatelectricalsbdn?mibextid=" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-brand-green text-white p-2 rounded-full transition-colors"><Facebook size={16} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green text-white p-2 rounded-full transition-colors"><Twitter size={16} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green text-white p-2 rounded-full transition-colors"><Instagram size={16} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green text-white p-2 rounded-full transition-colors"><Linkedin size={16} /></a>
               </div>
            </div>
            
            <div className="flex items-center bg-white/5 rounded-full py-1 px-3">
               <span className="text-gray-100 font-medium mr-3 hidden sm:block text-xs">Want to become a local dealer?</span>
               <Link to="/contact" className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-1 px-4 rounded-full transition-colors text-[10px] uppercase tracking-widest">Partner Program</Link>
            </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-4 md:mb-6">
           
           {/* Column 1: Useful Links */}
           <div>
              <h4 className="text-white font-bold mb-2 md:mb-3 font-heading tracking-wide uppercase text-xs">Quick Links</h4>
              <ul className="space-y-1.5 text-xs md:text-sm">
                 {mainNavLinks.map(link => (
                   <li key={link.name}>
                     <Link to={link.href} className="text-gray-300 font-medium hover:text-brand-green transition-colors">
                       {link.name}
                     </Link>
                   </li>
                 ))}
              </ul>
           </div>

           {/* Column 2: Our Products */}
           <div>
              <h4 className="text-white font-bold mb-2 md:mb-3 font-heading tracking-wide uppercase text-xs">Categories</h4>
              <ul className="space-y-1.5 text-xs md:text-sm">
                 {mainNavLinks
                   .filter(link => link.hasDropdown && link.dropdownItems)
                   .flatMap(link => link.dropdownItems || [])
                   .slice(0, 7)
                   .map(item => (
                     <li key={item.name}>
                       <Link to={item.href} className="text-gray-300 font-medium hover:text-brand-green transition-colors">
                         {item.name}
                       </Link>
                     </li>
                  ))}
              </ul>
           </div>

           {/* Column 3: Contact Info */}
           <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
              <h4 className="text-white font-bold mb-1.5 font-heading tracking-wide uppercase text-xs text-center lg:text-left w-full">Contact Info</h4>
              <div className="flex justify-center lg:justify-start items-center mb-1.5 m-0 p-0 w-full">
                <img src="/footer-logo-light.png?v=2.0" alt="New Bharat Electricals" className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[360px] h-auto object-contain m-0 p-0" onError={(e) => { 
                  const target = e.currentTarget;
                  if (!target.src.includes('images.unsplash.com')) {
                    target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                  }
                }} />
              </div>
              <div className="flex items-start text-gray-200 justify-center lg:justify-start w-full">
                 <MapPin className="text-brand-green mt-0.5 mr-2 flex-shrink-0" size={15} />
                 <p className="leading-relaxed font-medium text-xs md:text-sm text-center lg:text-left">
                   Near Dr Amar Singh, <br />
                   Chaudhary Saray Lalpul Road, <br />
                   Budaun HO, Budaun 243601, <br />
                   Uttar Pradesh
                 </p>
              </div>
           </div>

           {/* Column 4: Support */}
           <div>
              <h4 className="text-white font-bold mb-2 md:mb-3 font-heading tracking-wide uppercase text-xs">Support</h4>
              <div className="space-y-2 text-xs md:text-sm">
                 <div className="flex flex-col">
                   <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Call & Buy</span>
                   <a href="tel:+919457002000" className="text-brand-green-light font-bold text-sm md:text-base hover:text-brand-green transition-colors">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Solar Enquiry</span>
                   <a href="tel:+919457002000" className="text-gray-100 font-medium hover:text-brand-green transition-colors">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Email Support</span>
                   <a href="mailto:newbharatelectricals00@gmail.com" className="text-gray-100 font-medium hover:text-brand-green transition-colors">newbharatelectricals00@gmail.com</a>
                 </div>
                 
                 {/* Payment Methods Mockup */}
                 <div className="pt-2 border-t border-gray-800/50">
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">We Support</span>
                    <div className="flex gap-2 flex-wrap text-xl text-gray-400">
                       <i className="fa fa-cc-visa opacity-50 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-mastercard opacity-50 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-paypal opacity-50 hover:opacity-100 transition-opacity"></i>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 flex gap-1.5 flex-wrap">
                      <span className="bg-gray-800 px-1.5 py-0.5 rounded">UPI</span>
                      <span className="bg-gray-800 px-1.5 py-0.5 rounded">Net Banking</span>
                      <span className="bg-gray-800 px-1.5 py-0.5 rounded">EMI</span>
                    </p>
                 </div>
              </div>
           </div>

        </div>
        
        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 py-4 flex flex-col lg:flex-row justify-between items-center text-xs text-gray-400 font-medium">
            <div className="mb-2 lg:mb-0 text-center lg:text-left">
              Copyright © {new Date().getFullYear()} New Bharat Electricals . All Rights Reserved.  
              <span className="mx-1.5">|</span> <Link to="/terms-and-conditions" className="hover:text-brand-green transition-colors">Terms & Conditions</Link> 
              <span className="mx-1.5">|</span> <Link to="/privacy-policy" className="hover:text-brand-green transition-colors">Privacy Policy</Link> 
              <span className="mx-1.5">|</span> <Link to="/contact" className="hover:text-brand-green transition-colors">Disclaimer</Link>
              <span className="mx-1.5">|</span> <Link to="/admin" className="hover:text-brand-green transition-colors">Admin Login</Link>
            </div>
            <div className="text-center lg:text-right mt-1 lg:mt-0">
              Powered by advanced renewable engineering. <br className="lg:hidden" />
              Website proudly crafted with high-performance standards.
            </div>
        </div>

      </div>
    </footer>
  );
}
