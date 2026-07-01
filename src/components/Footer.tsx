import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-dark pt-16 relative text-sm border-t-4 border-brand-green">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        
        {/* Social Bar & Partner Call */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-8 mb-12">
            <div className="flex flex-col sm:flex-row items-center mb-6 md:mb-0 text-center sm:text-left">
               <span className="text-white font-heading font-bold text-xl mb-4 sm:mb-0 sm:mr-6 tracking-tight">Connect With Us</span>
               <div className="flex gap-3">
                 <a href="https://www.facebook.com/newbharatelectricalsbdn?mibextid=" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-brand-green text-white p-2.5 rounded-full transition-colors"><Facebook size={18} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green text-white p-2.5 rounded-full transition-colors"><Twitter size={18} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green text-white p-2.5 rounded-full transition-colors"><Instagram size={18} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green text-white p-2.5 rounded-full transition-colors"><Linkedin size={18} /></a>
               </div>
            </div>
            
            <div className="flex items-center bg-white/5 rounded-full py-2 px-4">
               <span className="text-gray-300 font-medium mr-4 hidden sm:block">Want to become a local dealer?</span>
               <Link to="/contact" className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-6 rounded-full transition-colors text-xs uppercase tracking-widest">Partner Program</Link>
            </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
           
           {/* Column 1: Useful Links */}
           <div>
              <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Useful Links</h4>
              <ul className="space-y-3">
                 <li><Link to="/store-locator" className="text-gray-400 hover:text-brand-green transition-colors">Store Locator</Link></li>
                 <li><Link to="/contact" className="text-gray-400 hover:text-brand-green transition-colors">Enquire Now</Link></li>
                 <li><Link to="/contact" className="text-gray-400 hover:text-brand-green transition-colors">Solar Financing</Link></li>
                 <li><Link to="/contact" className="text-gray-400 hover:text-brand-green transition-colors">Compliance & Certifications</Link></li>
                 <li><Link to="/catalogue" className="text-gray-400 hover:text-brand-green transition-colors">Brochure Downloads</Link></li>
              </ul>
           </div>

           {/* Column 2: Our Products */}
           <div>
              <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Our Products</h4>
              <ul className="space-y-3">
                 <li><Link to="/power-solutions/home-inverters" className="text-gray-400 hover:text-brand-green transition-colors">Home Inverters</Link></li>
                 <li><Link to="/power-solutions/battery-backup-systems" className="text-gray-400 hover:text-brand-green transition-colors">Inverter Batteries</Link></li>
                 <li><Link to="/mobility-solutions/ev-battery-solutions" className="text-gray-400 hover:text-brand-green transition-colors">EV Battery Solutions</Link></li>
                 <li><Link to="/power-solutions/industrial-inverters" className="text-gray-400 hover:text-brand-green transition-colors">3/Phase Industrial Inverters</Link></li>
                 <li><Link to="/power-solutions/ups-systems" className="text-gray-400 hover:text-brand-green transition-colors">UPS Systems</Link></li>
                 <li><Link to="/solar-solutions" className="text-gray-400 hover:text-brand-green transition-colors">Solar Solutions</Link></li>
                 <li><Link to="/accessories" className="text-gray-400 hover:text-brand-green transition-colors">Electrical Accessories</Link></li>
              </ul>
           </div>

           {/* Column 3: Contact Info */}
           <div className="lg:col-span-2">
              <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Contact Info</h4>
              <p className="text-gray-300 font-bold mb-2 text-lg">New Bharat Electricals</p>
              <div className="flex items-start text-gray-400 mb-6">
                 <MapPin className="text-brand-green mt-1 mr-3 flex-shrink-0" size={18} />
                 <p className="leading-relaxed">
                   Near Dr Amar Singh, <br />
                   Chaudhary Saray Lalpul Road, <br />
                   Budaun HO, Budaun 243601, <br />
                   Uttar Pradesh
                 </p>
              </div>
           </div>

           {/* Column 4: Support */}
           <div>
              <h4 className="text-white font-bold mb-6 font-heading tracking-wide uppercase">Support</h4>
              <div className="space-y-4">
                 <div className="flex flex-col">
                   <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Call & Buy</span>
                   <a href="tel:+919457002000" className="text-brand-green-light font-bold text-lg hover:text-brand-green transition-colors">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Solar Enquiry</span>
                   <a href="tel:+919457002000" className="text-gray-300 hover:text-brand-green transition-colors">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Email Support</span>
                   <a href="mailto:newbharatelectricals00@gmail.com" className="text-gray-300 hover:text-brand-green transition-colors">newbharatelectricals00@gmail.com</a>
                 </div>
                 
                 {/* Payment Methods Mockup */}
                 <div className="pt-4">
                    <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 block">We Support</span>
                    <div className="flex gap-2 flex-wrap text-2xl text-gray-400">
                       <i className="fa fa-cc-visa opacity-50 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-mastercard opacity-50 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-paypal opacity-50 hover:opacity-100 transition-opacity"></i>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex gap-2">
                      <span className="bg-gray-800 px-2 py-0.5 rounded">UPI</span>
                      <span className="bg-gray-800 px-2 py-0.5 rounded">Net Banking</span>
                      <span className="bg-gray-800 px-2 py-0.5 rounded">EMI</span>
                    </p>
                 </div>
              </div>
           </div>

        </div>
        
        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 py-8 flex flex-col lg:flex-row justify-between items-center text-xs text-gray-500">
            <div className="mb-4 lg:mb-0 text-center lg:text-left">
              Copyright © {new Date().getFullYear()} New Bharat Electricals . All Rights Reserved.  
              <span className="mx-2">|</span> <Link to="/contact" className="hover:text-brand-green transition-colors">Terms & Conditions</Link> 
              <span className="mx-2">|</span> <Link to="/contact" className="hover:text-brand-green transition-colors">Privacy Policy</Link> 
              <span className="mx-2">|</span> <Link to="/contact" className="hover:text-brand-green transition-colors">Disclaimer</Link>
              <span className="mx-2">|</span> <Link to="/admin" className="hover:text-brand-green transition-colors">Admin Login</Link>
            </div>
            <div className="text-center lg:text-right">
              Powered by advanced renewable engineering. <br className="lg:hidden" />
              Website proudly crafted with high-performance standards.
            </div>
        </div>

      </div>
    </footer>
  );
}
