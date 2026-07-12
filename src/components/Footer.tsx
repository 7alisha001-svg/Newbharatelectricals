
import { useState, useEffect } from 'react';
import { MapPin, Facebook, Instagram, Linkedin, Twitter, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { mainNavLinks as fallbackNavLinks } from '../data/navigation';

export default function Footer() {
  const { settings } = useStore();
  const mainNavLinks = settings?.social_links?.navigation || fallbackNavLinks;

  const [croppedLogo, setCroppedLogo] = useState<string | null>(null);
  const rawLogoUrl = settings?.social_links?.footer_logo || "/footer-logo-light.png";

  useEffect(() => {
    if (!rawLogoUrl) return;
    
    setCroppedLogo(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = rawLogoUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setCroppedLogo(rawLogoUrl);
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imgData;

        let minX = width, minY = height, maxX = 0, maxY = 0;
        let hasAlpha = false;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 5) {
              hasAlpha = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (!hasAlpha || maxX < minX || maxY < minY) {
          setCroppedLogo(rawLogoUrl);
          return;
        }

        const croppedWidth = maxX - minX + 1;
        const croppedHeight = maxY - minY + 1;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = croppedWidth;
        croppedCanvas.height = croppedHeight;
        const croppedCtx = croppedCanvas.getContext('2d');
        if (!croppedCtx) {
          setCroppedLogo(rawLogoUrl);
          return;
        }

        croppedCtx.drawImage(
          canvas,
          minX, minY, croppedWidth, croppedHeight,
          0, 0, croppedWidth, croppedHeight
        );

        setCroppedLogo(croppedCanvas.toDataURL());
      } catch (e) {
        setCroppedLogo(rawLogoUrl);
      }
    };
    img.onerror = () => {
      setCroppedLogo(rawLogoUrl);
    };
  }, [rawLogoUrl]);
  return (
    <footer className="bg-brand-dark pt-8 sm:pt-10 relative text-sm border-t-4 border-brand-green">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        
        {/* Desktop Social Bar & Partner Call */}
        <div className="hidden md:flex flex-row justify-between items-center border-b border-gray-800 pb-4 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-center mb-4 md:mb-0 text-center sm:text-left">
               <span className="text-white font-heading font-black text-lg mb-2 sm:mb-0 sm:mr-4 tracking-tight">Connect With Us</span>
               <div className="flex gap-3">
                 <a href="https://www.facebook.com/newbharatelectricalsbdn?mibextid=" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"><Facebook size={16} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"><Twitter size={16} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"><Instagram size={16} /></a>
                 <a href="#" className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"><Linkedin size={16} /></a>
               </div>
            </div>
            
            <div className="flex items-center bg-white/5 rounded-full py-1.5 px-4 border border-white/10">
               <span className="text-neutral-100 font-bold mr-3 hidden sm:block text-xs">Want to become a local dealer?</span>
               <Link to="/contact" className="bg-brand-green hover:bg-brand-green/90 text-white font-extrabold py-1 px-4 rounded-full transition-colors text-[10px] uppercase tracking-widest">Partner Program</Link>
            </div>
        </div>

        {/* Mobile Section 1: Logo, Description, Socials */}
        <div className="flex md:hidden flex-col items-center text-center border-b border-gray-800/60 pb-8 mb-6">
            <img 
              src={croppedLogo || rawLogoUrl} 
              alt={settings?.business_name || "New Bharat Electricals"} 
              className="h-12 w-auto object-contain mb-4"
              onError={(e) => { 
                const target = e.currentTarget;
                if (!target.src.includes('images.unsplash.com')) {
                  target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                }
              }} 
            />
            <p className="text-gray-400 text-sm mb-6 max-w-[280px] leading-relaxed">
              Powering Every Home & Business with premium electrical and solar solutions.
            </p>
            <div className="flex gap-4 mb-6">
              <a href="https://www.facebook.com/newbharatelectricalsbdn?mibextid=" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-brand-green text-white p-3 rounded-full transition-colors"><Facebook size={20} /></a>
              <a href="#" className="bg-white/5 hover:bg-brand-green text-white p-3 rounded-full transition-colors"><Twitter size={20} /></a>
              <a href="#" className="bg-white/5 hover:bg-brand-green text-white p-3 rounded-full transition-colors"><Instagram size={20} /></a>
              <a href="#" className="bg-white/5 hover:bg-brand-green text-white p-3 rounded-full transition-colors"><Linkedin size={20} /></a>
            </div>
            <Link to="/contact" className="bg-brand-green text-white font-extrabold py-3 px-8 rounded-full transition-colors text-xs uppercase tracking-widest shadow-md">Partner Program</Link>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-6 md:gap-8 mb-6 md:mb-8">
           
           {/* Column 1: Useful Links */}
           <div className="col-span-1">
              <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm md:border-b md:border-gray-800/60 pb-2 w-full block text-left">Quick Links</h4>
              <ul className="space-y-4 md:space-y-2.5 text-sm">
                 {mainNavLinks.map(link => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1 md:py-0">
                        {link.name}
                      </Link>
                    </li>
                 ))}
                 <li className="md:hidden">
                    <Link to="/privacy-policy" className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1">
                      Privacy Policy
                    </Link>
                 </li>
                 <li className="md:hidden">
                    <Link to="/terms-and-conditions" className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1">
                      Terms & Conditions
                    </Link>
                 </li>
              </ul>
           </div>

           {/* Column 2: Our Products */}
           <div className="col-span-1">
              <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm md:border-b md:border-gray-800/60 pb-2 w-full block text-left">Categories</h4>
              <ul className="space-y-4 md:space-y-2.5 text-sm">
                 {mainNavLinks
                   .filter(link => link.hasDropdown && link.dropdownItems)
                   .flatMap(link => link.dropdownItems || [])
                   .slice(0, 7)
                   .map(item => (
                     <li key={item.name}>
                       <Link to={item.href} className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1 md:py-0">
                         {item.name}
                       </Link>
                     </li>
                   ))}
              </ul>
           </div>

           {/* Column 3: Contact Info */}
           <div className="col-span-2 md:col-span-1 lg:col-span-2 flex flex-col items-start md:items-center lg:items-start text-left md:text-center lg:text-left border-t border-gray-800/60 pt-8 mt-4 md:border-t-0 md:pt-0 md:mt-0">
              <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm md:border-b md:border-gray-800/60 pb-2 w-full block text-left">Contact Info</h4>
              
              <div className="hidden md:flex justify-center lg:justify-start items-center p-0 w-full mb-2">
                <img 
                  src={croppedLogo || rawLogoUrl} 
                  alt={settings?.business_name || "New Bharat Electricals"} 
                  style={{ 
                    maxWidth: settings?.social_links?.footer_logo_size 
                      ? `${settings.social_links.footer_logo_size}px` 
                      : undefined 
                  }} 
                  className={`w-auto ${
                    settings?.social_links?.footer_logo_size 
                      ? '' 
                      : 'h-12 sm:h-14 md:h-16 lg:h-18'
                  } object-contain block transition-transform duration-300 hover:scale-[1.05]`} 
                  onError={(e) => { 
                    const target = e.currentTarget;
                    if (!target.src.includes('images.unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop';
                    }
                  }} 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-2 w-full">
                <div className="flex items-start text-neutral-100 justify-start md:justify-center lg:justify-start w-full gap-3">
                   <div className="bg-brand-green/20 md:bg-brand-green p-1.5 rounded-full mt-0.5 flex-shrink-0">
                     <MapPin className="text-brand-green md:text-white" size={16} />
                   </div>
                   <div className="text-left md:text-center lg:text-left">
                     <p className="font-bold text-sm mb-1 text-white">Corporate Office</p>
                     <p className="leading-relaxed font-semibold text-sm whitespace-pre-line text-neutral-300">
                       {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.address || 
                        settings?.office_address || 
                        'Near Dr Amar Singh,\nChaudhary Saray Lalpul Road,\nBudaun HO, Budaun 243601,\nUttar Pradesh'}
                     </p>
                   </div>
                </div>

                <div className="flex items-start text-neutral-100 justify-start md:justify-center lg:justify-start w-full gap-3">
                   <div className="bg-brand-green/20 md:bg-brand-green p-1.5 rounded-full mt-0.5 flex-shrink-0">
                     <MapPin className="text-brand-green md:text-white" size={16} />
                   </div>
                   <div className="text-left md:text-center lg:text-left">
                     <p className="font-bold text-sm mb-1 text-white">Warehouse</p>
                     <p className="leading-relaxed font-semibold text-sm whitespace-pre-line text-neutral-300">
                       {settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.address || 
                        settings?.warehouse_address || 
                        'Loda Bahedi,\nBudaun,\nUttar Pradesh – 243601'}
                     </p>
                   </div>
                </div>
              </div>

              {/* Mobile Extra Contact Info */}
              <div className="flex md:hidden flex-col w-full mt-4 space-y-4">
                 <div className="flex items-start text-neutral-100 justify-start w-full gap-3">
                    <div className="bg-brand-green/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                       <Phone className="text-brand-green" size={16} />
                    </div>
                    <a href="tel:+919457002000" className="leading-relaxed font-semibold text-sm hover:text-brand-green block py-1">+91 94570 02000</a>
                 </div>
                 <div className="flex items-start text-neutral-100 justify-start w-full gap-3">
                    <div className="bg-brand-green/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                       <Mail className="text-brand-green" size={16} />
                    </div>
                    <a href="mailto:newbharatelectricals00@gmail.com" className="leading-relaxed font-semibold text-sm hover:text-brand-green break-all block py-1">newbharatelectricals00@gmail.com</a>
                 </div>
                 <div className="flex items-start text-neutral-100 justify-start w-full gap-3">
                    <div className="bg-brand-green/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                       <Clock className="text-brand-green" size={16} />
                    </div>
                    <p className="leading-relaxed font-semibold text-sm block py-1">Mon - Sat: 10:00 AM - 7:00 PM</p>
                 </div>
              </div>
           </div>

           {/* Column 4: Support */}
           <div className="hidden md:block md:col-span-1 lg:col-span-1">
              <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm border-b border-gray-800/60 pb-2 w-full block text-left">Support</h4>
              
              {/* Desktop Support block */}
              <div className="flex space-y-4 text-sm flex-col items-center sm:items-start">
                 <div className="flex flex-col items-center sm:items-start">
                   <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">Call & Buy</span>
                   <a href="tel:+919457002000" className="text-brand-green-light font-black text-sm md:text-base hover:text-brand-green transition-colors duration-200">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col items-center sm:items-start">
                   <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">Solar Enquiry</span>
                   <a href="tel:+919457002000" className="text-white font-bold hover:text-brand-green transition-colors duration-200">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col items-center sm:items-start">
                   <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">Email Support</span>
                   <a href="mailto:newbharatelectricals00@gmail.com" className="text-white font-bold hover:text-brand-green transition-colors duration-200">newbharatelectricals00@gmail.com</a>
                 </div>
                 
                 {/* Payment Methods Mockup */}
                 <div className="pt-3.5 border-t border-gray-800/60 w-full flex flex-col items-center sm:items-start">
                    <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-2 block">We Support</span>
                    <div className="flex gap-2.5 flex-wrap text-2xl text-neutral-100 justify-center sm:justify-start">
                       <i className="fa fa-cc-visa opacity-95 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-mastercard opacity-95 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-paypal opacity-95 hover:opacity-100 transition-opacity"></i>
                    </div>
                    <p className="text-xs text-neutral-100 font-extrabold mt-2.5 flex gap-1.5 flex-wrap justify-center sm:justify-start">
                      <span className="bg-gray-800 px-2.5 py-1 rounded">UPI</span>
                      <span className="bg-gray-800 px-2.5 py-1 rounded">Net Banking</span>
                      <span className="bg-gray-800 px-2.5 py-1 rounded">EMI</span>
                    </p>
                 </div>
              </div>
           </div>

        </div>
        
        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 py-6 md:py-4 flex flex-col lg:flex-row justify-between items-center text-xs text-neutral-200 font-semibold gap-4 md:gap-3">
            <div className="text-center lg:text-left leading-relaxed flex flex-col md:flex-row md:flex-wrap justify-center lg:justify-start items-center space-y-3 md:space-y-0">
              <span className="text-gray-400">Copyright © {new Date().getFullYear()} New Bharat Electricals. All Rights Reserved.</span>
              
              <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-2 mt-2 md:mt-0">
                <span className="hidden md:inline mx-1.5 text-gray-500">|</span> 
                <Link to="/terms-and-conditions" className="hover:text-brand-green transition-colors text-gray-400 md:text-neutral-200">Terms & Conditions</Link> 
                <span className="text-gray-500 hidden md:inline">|</span> 
                <Link to="/privacy-policy" className="hover:text-brand-green transition-colors text-gray-400 md:text-neutral-200">Privacy Policy</Link> 
                <span className="text-gray-500 hidden md:inline">|</span> 
                <Link to="/contact" className="hover:text-brand-green transition-colors text-gray-400 md:text-neutral-200">Disclaimer</Link>
                <span className="text-gray-500 hidden md:inline">|</span> 
                <Link to="/admin" className="hover:text-brand-green transition-colors text-gray-400 md:text-neutral-200">Admin Login</Link>
              </div>
            </div>
            <div className="text-center lg:text-right mt-2 md:mt-0 leading-relaxed text-gray-400">
              Powered by advanced renewable engineering. <br className="lg:hidden" />
              <span className="text-gray-500 font-medium">Website proudly crafted with high-performance standards.</span>
            </div>
        </div>

      </div>
    </footer>
  );
}
