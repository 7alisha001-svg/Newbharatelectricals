
import { useState, useEffect } from 'react';
import { MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
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
    <footer className="bg-brand-dark pt-6 sm:pt-8 relative text-sm border-t-4 border-brand-green">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        
        {/* Social Bar & Partner Call */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-3 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-center mb-3 md:mb-0 text-center sm:text-left">
               <span className="text-white font-heading font-black text-lg mb-2 sm:mb-0 sm:mr-4 tracking-tight">Connect With Us</span>
               <div className="flex gap-2">
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

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-6 md:mb-8">
           
           {/* Column 1: Useful Links */}
           <div>
              <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm border-b border-gray-800/60 pb-2 w-full block">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                 {mainNavLinks.map(link => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-neutral-100 font-semibold hover:text-brand-lime transition-colors duration-200">
                        {link.name}
                      </Link>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Column 2: Our Products */}
           <div>
              <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm border-b border-gray-800/60 pb-2 w-full block">Categories</h4>
              <ul className="space-y-2.5 text-sm">
                 {mainNavLinks
                   .filter(link => link.hasDropdown && link.dropdownItems)
                   .flatMap(link => link.dropdownItems || [])
                   .slice(0, 7)
                   .map(item => (
                     <li key={item.name}>
                       <Link to={item.href} className="text-neutral-100 font-semibold hover:text-brand-lime transition-colors duration-200">
                         {item.name}
                       </Link>
                     </li>
                   ))}
              </ul>
           </div>

           {/* Column 3: Contact Info */}
           <div className="lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="text-white font-black mb-2 font-heading tracking-widest uppercase text-sm border-b border-gray-800/60 pb-2 w-full block text-center lg:text-left">Contact Info</h4>
              <div className="flex justify-center lg:justify-start items-center p-0 w-full">
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
              <div className="flex items-start text-neutral-100 justify-center lg:justify-start w-full gap-2.5 mt-2">
                 <div className="bg-brand-green p-1.5 rounded-full mt-0.5 flex-shrink-0">
                   <MapPin className="text-white" size={16} />
                 </div>
                 <p className="leading-relaxed font-semibold text-sm text-center lg:text-left">
                   Near Dr Amar Singh, <br />
                   Chaudhary Saray Lalpul Road, <br />
                   Budaun HO, Budaun 243601, <br />
                   Uttar Pradesh
                 </p>
              </div>
           </div>

           {/* Column 4: Support */}
           <div>
              <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm border-b border-gray-800/60 pb-2 w-full block">Support</h4>
              <div className="space-y-4 text-sm">
                 <div className="flex flex-col">
                   <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">Call & Buy</span>
                   <a href="tel:+919457002000" className="text-brand-green-light font-black text-sm md:text-base hover:text-brand-lime transition-colors duration-200">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">Solar Enquiry</span>
                   <a href="tel:+919457002000" className="text-white font-bold hover:text-brand-lime transition-colors duration-200">+91 94570 02000</a>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">Email Support</span>
                   <a href="mailto:newbharatelectricals00@gmail.com" className="text-white font-bold hover:text-brand-lime transition-colors duration-200">newbharatelectricals00@gmail.com</a>
                 </div>
                 
                 {/* Payment Methods Mockup */}
                 <div className="pt-3.5 border-t border-gray-800/60">
                    <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-2 block">We Support</span>
                    <div className="flex gap-2.5 flex-wrap text-2xl text-neutral-100">
                       <i className="fa fa-cc-visa opacity-95 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-mastercard opacity-95 hover:opacity-100 transition-opacity"></i>
                       <i className="fa fa-cc-paypal opacity-95 hover:opacity-100 transition-opacity"></i>
                    </div>
                    <p className="text-xs text-neutral-100 font-extrabold mt-2.5 flex gap-1.5 flex-wrap">
                      <span className="bg-gray-800 px-2.5 py-1 rounded">UPI</span>
                      <span className="bg-gray-800 px-2.5 py-1 rounded">Net Banking</span>
                      <span className="bg-gray-800 px-2.5 py-1 rounded">EMI</span>
                    </p>
                 </div>
              </div>
           </div>

        </div>
        
        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 py-4 flex flex-col lg:flex-row justify-between items-center text-xs text-neutral-200 font-semibold gap-3">
            <div className="mb-2 lg:mb-0 text-center lg:text-left leading-relaxed">
              Copyright © {new Date().getFullYear()} New Bharat Electricals . All Rights Reserved.  
              <span className="mx-1.5">|</span> <Link to="/terms-and-conditions" className="hover:text-brand-lime transition-colors">Terms & Conditions</Link> 
              <span className="mx-1.5">|</span> <Link to="/privacy-policy" className="hover:text-brand-lime transition-colors">Privacy Policy</Link> 
              <span className="mx-1.5">|</span> <Link to="/contact" className="hover:text-brand-lime transition-colors">Disclaimer</Link>
              <span className="mx-1.5">|</span> <Link to="/admin" className="hover:text-brand-lime transition-colors">Admin Login</Link>
            </div>
            <div className="text-center lg:text-right mt-1 lg:mt-0 leading-relaxed text-gray-300">
              Powered by advanced renewable engineering. <br className="lg:hidden" />
              Website proudly crafted with high-performance standards.
            </div>
        </div>

      </div>
    </footer>
  );
}
