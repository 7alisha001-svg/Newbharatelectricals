import {
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useMedia } from '../context/MediaContext';
import MediaImage from './MediaImage';
import { mainNavLinks as fallbackNavLinks } from '../data/navigation';

export default function Footer() {
  const { settings } = useStore();
  const { getMediaUrl } = useMedia();

  const mainNavLinks = Array.isArray(settings?.social_links?.navigation)
    ? settings.social_links.navigation
    : fallbackNavLinks;

  const mediaFooterLogo = getMediaUrl('footer_logo');

  return (
    <footer className="bg-brand-dark pt-6 sm:pt-10 relative text-sm border-t-4 border-brand-green">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">

        {/* Desktop Social Bar & Partner Call */}
        <div className="hidden md:flex flex-row justify-between items-center border-b border-gray-800 pb-4 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center mb-4 md:mb-0 text-center sm:text-left">
            <span className="text-white font-heading font-black text-lg mb-2 sm:mb-0 sm:mr-4 tracking-tight">
              Connect With Us
            </span>

            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/newbharatelectricalsbdn?mibextid="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"
              >
                <Facebook size={16} />
              </a>

              <a
                href="#"
                className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"
              >
                <Twitter size={16} />
              </a>

              <a
                href="#"
                className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"
              >
                <Instagram size={16} />
              </a>

              <a
                href="#"
                className="bg-white/10 hover:bg-brand-green hover:text-white text-white p-2 rounded-full transition-colors"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div className="flex items-center bg-white/5 rounded-full py-1.5 px-4 border border-white/10">
            <span className="text-neutral-100 font-bold mr-3 hidden sm:block text-xs">
              Want to become a local dealer?
            </span>

            <Link
              to="/contact"
              className="bg-brand-green hover:bg-brand-green/90 text-white font-extrabold py-1 px-4 rounded-full transition-colors text-[10px] uppercase tracking-widest"
            >
              Partner Program
            </Link>
          </div>
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden justify-center items-center border-b border-gray-800/60 pb-4 mb-4">
          <MediaImage
            imageKey="footer_logo"
            defaultSrc={settings?.social_links?.footer_logo || '/footer-logo-light.png'}
            fallbackSrc="/footer-logo-light.png"
            alt={settings?.business_name || 'New Bharat Electricals Footer Logo'}
            className="h-10 max-w-[200px] w-auto object-contain"
          />
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-6 md:gap-8 mb-4 md:mb-8">

          {/* Column 1: Quick Links */}
          <div className="col-span-1">
            <h4 className="text-white font-black mb-2 sm:mb-4 font-heading tracking-widest uppercase text-xs sm:text-sm md:border-b md:border-gray-800/60 md:pb-2 w-full block text-left">
              Quick Links
            </h4>

            <ul className="space-y-1.5 sm:space-y-2.5 md:space-y-2.5 text-xs sm:text-sm">
              {mainNavLinks.map((link: any) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1 md:py-0"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              <li className="md:hidden">
                <Link
                  to="/privacy-policy"
                  className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1"
                >
                  Privacy Policy
                </Link>
              </li>

              <li className="md:hidden">
                <Link
                  to="/terms-and-conditions"
                  className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Categories */}
          <div className="col-span-1 hidden md:block">
            <h4 className="text-white font-black mb-2 sm:mb-4 font-heading tracking-widest uppercase text-xs sm:text-sm md:border-b md:border-gray-800/60 md:pb-2 w-full block text-left">
              Categories
            </h4>

            <ul className="space-y-1.5 sm:space-y-2.5 md:space-y-2.5 text-xs sm:text-sm md:hidden">
              {mainNavLinks
                .filter(
                  (link: any) => link.hasDropdown && link.dropdownItems
                )
                .flatMap(
                  (link: any) => link.dropdownItems || []
                )
                .slice(7)
                .map((item: any) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>

            <ul className="hidden md:block space-y-1.5 sm:space-y-2.5 md:space-y-2.5 text-xs sm:text-sm">
              {mainNavLinks
                .filter(
                  (link: any) => link.hasDropdown && link.dropdownItems
                )
                .flatMap(
                  (link: any) => link.dropdownItems || []
                )
                .slice(0, 7)
                .map((item: any) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-neutral-100 font-semibold hover:text-brand-green transition-colors duration-200 block py-1 md:py-0"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
             <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2 flex flex-col items-start text-left border-t border-gray-800/60 pt-4 sm:pt-8 mt-1 md:border-t-0 md:pt-0 md:mt-0">

             <h4 className="text-white font-black mb-2 sm:mb-4 font-heading tracking-widest uppercase text-xs sm:text-sm md:border-b md:border-gray-800/60 md:pb-2 w-full block text-left">
               Contact Info
             </h4>

            {/* Desktop Footer Logo */}
            <div className="hidden md:flex justify-center lg:justify-start items-center p-0 w-full mb-3">
              <MediaImage
                imageKey="footer_logo"
                defaultSrc={settings?.social_links?.footer_logo || '/footer-logo-light.png'}
                fallbackSrc="/footer-logo-light.png"
                alt={settings?.business_name || 'New Bharat Electricals Footer Logo'}
                style={{
                  maxWidth: settings?.social_links?.footer_logo_size
                    ? `${settings.social_links.footer_logo_size}px`
                    : '340px',
                }}
                className={`w-auto h-auto ${
                  settings?.social_links?.footer_logo_size
                    ? 'max-h-[120px] md:max-h-[140px]'
                    : 'max-h-[80px] md:max-h-[100px] lg:max-h-[120px]'
                } max-w-full object-contain block transition-transform duration-300 hover:scale-[1.03]`}
              />
            </div>

             {/* Office + Warehouse */}
              <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-6 mt-1 w-full">

              {/* Corporate Office */}
              <div className="flex items-start text-neutral-100 justify-start w-full gap-2 sm:gap-3">
                <div className="bg-brand-green/20 md:bg-brand-green p-1.5 rounded-full mt-0.5 flex-shrink-0">
                  <MapPin
                    className="text-brand-green md:text-white"
                    size={16}
                  />
                </div>

                <div className="text-left">
                  <p className="font-bold text-xs sm:text-sm mb-1 text-white">
                    Corporate Office
                  </p>

                  <p className="leading-relaxed font-semibold text-xs sm:text-sm whitespace-pre-line text-neutral-100">
                    {(Array.isArray(settings?.social_links?.locations) &&
                      settings.social_links.locations.find(
                        (l: any) => l.type === 'office'
                      )?.address) ||
                      settings?.office_address ||
                      'Near Dr Amar Singh,\nChaudhary Saray Lalpul Road,\nBudaun HO, Budaun 243601,\nUttar Pradesh'}
                  </p>
                </div>
              </div>

              {/* Warehouse */}
              <div className="flex items-start text-neutral-100 justify-start w-full gap-2 sm:gap-3">
                <div className="bg-brand-green/20 md:bg-brand-green p-1.5 rounded-full mt-0.5 flex-shrink-0">
                  <MapPin
                    className="text-brand-green md:text-white"
                    size={16}
                  />
                </div>

                <div className="text-left">
                  <p className="font-bold text-xs sm:text-sm mb-1 text-white">
                    Warehouse
                  </p>

                  <p className="leading-relaxed font-semibold text-xs sm:text-sm whitespace-pre-line text-neutral-100">
                    {(Array.isArray(settings?.social_links?.locations) &&
                      settings.social_links.locations.find(
                        (l: any) => l.type === 'warehouse'
                      )?.address) ||
                      settings?.warehouse_address ||
                      'New Bharat Electricals\nNational Highway 530B\nOpp. Florence Nightingale\nUjhani Road\nBadaun – 243601\nUttar Pradesh'}
                  </p>
                </div>
              </div>

            </div>

             {/* Mobile Extra Contact Info */}
            <div className="flex md:hidden flex-col w-full mt-3 space-y-2">

              <div className="flex items-start text-neutral-100 justify-start w-full gap-2 sm:gap-3">
                <div className="bg-brand-green/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                  <Phone className="text-brand-green" size={16} />
                </div>

                 <a
                   href="tel:+919457002000"
                   className="leading-relaxed font-semibold text-sm hover:text-brand-green block text-xs sm:text-sm"
                 >
                  +91 94570 02000
                </a>
              </div>

              <div className="flex items-start text-neutral-100 justify-start w-full gap-2 sm:gap-3">
                <div className="bg-brand-green/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                  <Mail className="text-brand-green" size={16} />
                </div>

                 <a
                   href="mailto:Info@newbharatelectricals.com"
                   className="leading-relaxed font-semibold text-sm hover:text-brand-green break-all block text-xs sm:text-sm"
                 >
                  Info@newbharatelectricals.com
                </a>
              </div>

              <div className="flex items-start text-neutral-100 justify-start w-full gap-2 sm:gap-3">
                <div className="bg-brand-green/20 p-1.5 rounded-full mt-0.5 flex-shrink-0">
                  <Clock className="text-brand-green" size={16} />
                </div>

                 <p className="leading-relaxed font-semibold text-sm block text-xs sm:text-sm">
                  Mon - Sat: 10:00 AM - 7:00 PM
                </p>
              </div>

            </div>
          </div>

          {/* Column 4: Support */}
          <div className="hidden md:block md:col-span-1 lg:col-span-1">
            <h4 className="text-white font-black mb-4 font-heading tracking-widest uppercase text-sm border-b border-gray-800/60 pb-2 w-full block text-left">
              Support
            </h4>

            <div className="flex space-y-4 text-sm flex-col items-center sm:items-start">

              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">
                  Call & Buy
                </span>
                <a
                  href="tel:+919457002000"
                  className="text-brand-green-light font-black text-sm md:text-base hover:text-brand-green transition-colors duration-200"
                >
                  +91 94570 02000
                </a>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">
                  Solar Enquiry
                </span>
                <a
                  href="tel:+919457002000"
                  className="text-white font-bold hover:text-brand-green transition-colors duration-200"
                >
                  +91 94570 02000
                </a>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-1">
                  Email Support
                </span>
                <a
                  href="mailto:Info@newbharatelectricals.com"
                  className="text-white font-bold hover:text-brand-green transition-colors duration-200"
                >
                  Info@newbharatelectricals.com
                </a>
              </div>

              {/* Payment Methods */}
              <div className="pt-3.5 border-t border-gray-800/60 w-full flex flex-col items-center sm:items-start">
                <span className="text-gray-300 text-xs uppercase font-extrabold tracking-wider mb-2 block">
                  We Support
                </span>

                <div className="flex gap-2.5 flex-wrap text-2xl text-neutral-100 justify-center sm:justify-start">
                  <i className="fa fa-cc-visa opacity-95 hover:opacity-100 transition-opacity"></i>
                  <i className="fa fa-cc-mastercard opacity-95 hover:opacity-100 transition-opacity"></i>
                  <i className="fa fa-cc-paypal opacity-95 hover:opacity-100 transition-opacity"></i>
                </div>

                <p className="text-xs text-neutral-100 font-extrabold mt-2.5 flex gap-1.5 flex-wrap justify-center sm:justify-start">
                  <span className="bg-gray-800 px-2.5 py-1 rounded">
                    UPI
                  </span>
                  <span className="bg-gray-800 px-2.5 py-1 rounded">
                    Net Banking
                  </span>
                  <span className="bg-gray-800 px-2.5 py-1 rounded">
                    EMI
                  </span>
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 py-4 md:py-4 flex flex-col lg:flex-row justify-between items-center text-xs text-neutral-100 font-semibold gap-3 md:gap-3">

          <div className="text-center lg:text-left leading-relaxed flex flex-col md:flex-row md:flex-wrap justify-center lg:justify-start items-center space-y-2 md:space-y-0">

            <span className="text-gray-200">
              Copyright © {new Date().getFullYear()} New Bharat Electricals. All Rights Reserved.
            </span>

            <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-2 mt-2 md:mt-0">
              <span className="hidden md:inline mx-1.5 text-gray-300">|</span>

              <Link
                to="/terms-and-conditions"
                className="hover:text-brand-green transition-colors text-gray-200 md:text-neutral-100"
              >
                Terms & Conditions
              </Link>

              <span className="text-gray-300 hidden md:inline">|</span>

              <Link
                to="/privacy-policy"
                className="hover:text-brand-green transition-colors text-gray-200 md:text-neutral-100"
              >
                Privacy Policy
              </Link>

              <span className="text-gray-300 hidden md:inline">|</span>

              <Link
                to="/contact"
                className="hover:text-brand-green transition-colors text-gray-200 md:text-neutral-100"
              >
                Disclaimer
              </Link>

              <span className="text-gray-300 hidden md:inline">|</span>

              <Link
                to="/admin"
                className="hover:text-brand-green transition-colors text-gray-200 md:text-neutral-100"
              >
                Admin Login
              </Link>
            </div>
          </div>

          <div className="text-center lg:text-right mt-1 md:mt-0 leading-relaxed text-gray-200">
            Powered by advanced renewable engineering.
            <br className="lg:hidden" />
            <span className="text-gray-300 font-medium">
              Website proudly crafted with high-performance standards.
            </span>
          </div>

        </div>

        {/* Developer Credit */}
        <div className="border-t border-gray-800/40 pt-3 pb-2 flex flex-col sm:flex-row justify-center items-center text-[11px] sm:text-xs text-neutral-400 font-medium gap-1 sm:gap-2 text-center">
          <span>
            Designed & Developed by{' '}
            <span className="text-gray-300 font-semibold">
              Bilal Saifi
            </span>
          </span>

          <span className="hidden sm:inline text-gray-600">|</span>

          <a
            href="mailto:bilsaifi001@gmail.com"
            className="text-brand-green hover:text-brand-green-light transition-colors duration-200 font-semibold"
          >
            bilsaifi001@gmail.com
          </a>
        </div>

      </div>
    </footer>
  );
}