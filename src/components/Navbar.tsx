import { Phone, MessageCircle, ChevronDown, Menu, X, Heart, User, MapPin, Search, ShoppingCart, Store, Headset } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { mainNavLinks } from '../data/navigation';

const croppedNavbarLogoCache: Record<string, string> = {};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, brands } = useStore();
  
  // Build dynamic navLinks based on settings or fallback
  const baseNavLinks = (Array.isArray(settings?.social_links?.navigation) ? settings.social_links.navigation : mainNavLinks);
  const navLinks = (Array.isArray(baseNavLinks) ? baseNavLinks : mainNavLinks).map((link: any) => {
    if (link.name === 'Brands') {
      return {
        ...link,
        hasDropdown: true,
        dropdownItems: brands.filter(b => b.is_active !== false).map(b => ({
          name: b.name,
          href: `/brands/${b.slug || b.name?.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        }))
      };
    }
    return link;
  });
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { cartCount } = useCart();

  const rawLogoUrl = settings?.logo_url && !settings.logo_url.includes('settings/header-logo-dark.png') 
    ? settings.logo_url 
    : "/header-logo-dark.png";

  const [croppedLogo, setCroppedLogo] = useState<string | null>(() => {
    return croppedNavbarLogoCache[rawLogoUrl] || null;
  });

  useEffect(() => {
    if (!rawLogoUrl) return;
    
    if (croppedNavbarLogoCache[rawLogoUrl]) {
      setCroppedLogo(croppedNavbarLogoCache[rawLogoUrl]);
      return;
    }

    setCroppedLogo(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = rawLogoUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          croppedNavbarLogoCache[rawLogoUrl] = rawLogoUrl;
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
          croppedNavbarLogoCache[rawLogoUrl] = rawLogoUrl;
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
          croppedNavbarLogoCache[rawLogoUrl] = rawLogoUrl;
          setCroppedLogo(rawLogoUrl);
          return;
        }

        croppedCtx.drawImage(
          canvas,
          minX, minY, croppedWidth, croppedHeight,
          0, 0, croppedWidth, croppedHeight
        );

        const dataUrl = croppedCanvas.toDataURL();
        croppedNavbarLogoCache[rawLogoUrl] = dataUrl;
        setCroppedLogo(dataUrl);
      } catch (e) {
        croppedNavbarLogoCache[rawLogoUrl] = rawLogoUrl;
        setCroppedLogo(rawLogoUrl);
      }
    };
    img.onerror = () => {
      croppedNavbarLogoCache[rawLogoUrl] = rawLogoUrl;
      setCroppedLogo(rawLogoUrl);
    };
  }, [rawLogoUrl]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedMenus({});
  }, [location]);

  const toggleMenu = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Top Bar - Vijay Sales Style (Red Background) */}
      <div className="bg-brand-green text-white hidden md:block text-xs font-medium py-1">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="tel:+919457002000" className="flex items-center hover:opacity-80 transition-opacity">
              <Phone size={14} className="mr-1.5" /> +91 94570 02000
            </a>
            <a href="https://wa.me/919457002000" target="_blank" rel="noreferrer" className="flex items-center hover:opacity-80 transition-opacity">
              <MessageCircle size={14} className="mr-1.5" /> WhatsApp Support
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/store-locator" className="flex items-center hover:opacity-80 transition-opacity">
              <MapPin size={14} className="mr-1.5" /> Store Locator
            </Link>
            <Link to="/contact" className="hover:opacity-80 transition-opacity">Contact Us</Link>
          </div>
        </div>
      </div>

      <header className={`sticky w-full top-0 z-50 transition-all duration-300 bg-white border-none ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-0.5 md:py-2">
          {/* Main Header / Logo / Search / Icons */}
          <div className="flex items-center justify-between gap-2 md:gap-4 mb-0">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 p-0 m-0">
              <Link to="/" className="flex items-center group p-0 m-0">
                <img 
                  src={croppedLogo || rawLogoUrl} 
                  alt={settings?.business_name || "New Bharat Electricals"} 
                  style={{
                    ['--desktop-logo-height' as any]: settings?.social_links?.header_logo_size ? `${Math.round(settings.social_links.header_logo_size * 0.82)}px` : undefined
                  }}
                  className={`${
                    settings?.social_links?.header_logo_size 
                      ? 'h-10 sm:h-12 md:h-[var(--desktop-logo-height)]' 
                      : 'h-10 sm:h-12 md:h-[46px] lg:h-[52px] xl:h-16'
                  } w-auto object-contain block group-hover:-translate-y-0.5 transition-transform p-0 m-0`}
                  onError={(e) => { 
                    const target = e.currentTarget;
                    if (target.src !== '/header-logo-dark.png') {
                      target.src = '/header-logo-dark.png';
                    }
                  }} />
              </Link>
            </div>

            {/* Location Selector */}
            <div className="hidden xl:flex items-center text-sm lg:pr-2">
              <MapPin size={24} className="text-gray-900 mr-2" strokeWidth={1.5} />
              <div className="flex flex-col leading-tight">
                <span className="text-gray-700 font-medium text-[11px]">Deliver to</span>
                <span className="font-bold text-gray-900 text-xs border-b border-gray-900 hover:text-brand-green hover:border-brand-green cursor-pointer transition-colors pb-0.5">Select your location</span>
              </div>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden lg:flex flex-grow max-w-[700px] relative">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-700 font-medium" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for Inverters, Batteries, Solar Panels..." 
                  className="w-full bg-[#f1f1f1] border-none text-gray-900 text-sm rounded-full pl-12 pr-4 py-3 outline-none focus:bg-[#e5e5e5] transition-colors"
                />
              </div>
            </div>

            {/* Right Side Icons (Retail Style) */}
            <div className="hidden lg:flex flex-shrink-0 items-center space-x-6 text-gray-900 ml-4">
              <Link to="/store-locator" className="hover:text-brand-green transition-colors flex items-center group">
                <Store size={22} strokeWidth={1.5} className="mr-1.5" />
                <span className="text-sm font-bold">Store Locator</span>
              </Link>
              
              <Link to="/contact" className="hover:text-brand-green transition-colors flex items-center group">
                <Headset size={22} strokeWidth={1.5} className="mr-1.5" />
                <span className="text-sm font-bold">Help Center</span>
              </Link>

              <Link to="/contact" className="hover:text-brand-green transition-colors flex items-center group">
                <Heart size={24} strokeWidth={1.5} className="group-hover:fill-brand-green/20" />
              </Link>

              <Link to="/contact" className="hover:text-brand-green transition-colors flex items-center group">
                <User size={24} strokeWidth={1.5} />
              </Link>

              <Link to="/cart" className="hover:text-brand-green transition-colors flex items-center group relative mt-1">
                <ShoppingCart size={24} strokeWidth={1.5} />
                {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-brand-green text-white text-[9px] font-bold rounded-full flex items-center justify-center -mt-2 -mr-2">{cartCount}</span>}
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center lg:hidden space-x-2 sm:space-x-3">
              <button className="text-gray-900 hover:text-brand-green p-2.5 sm:p-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" aria-label="Search">
                <Search size={22} className="sm:w-6 sm:h-6" />
              </button>
              <Link to="/cart" className="text-gray-900 hover:text-brand-green relative p-2.5 sm:p-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]" aria-label="Cart">
                <ShoppingCart size={22} className="sm:w-6 sm:h-6" />
                {cartCount > 0 && <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-brand-green text-white text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
              </Link>
              <button 
                className="text-gray-900 hover:text-brand-green transition-colors p-2.5 sm:p-3 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px] focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={24} className="sm:w-6 sm:h-6" /> : <Menu size={24} className="sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Categories Bottom Bar */}
          <nav className="hidden lg:flex mt-4">
            <ul className="flex items-center space-x-10 text-[15px] font-bold uppercase tracking-wide">
              {navLinks.map((link) => (
                <li key={link.name} className="relative group">
                  <Link 
                    to={link.href} 
                    className={`flex items-center transition-colors pt-1 pb-3 border-b-2 group-hover:border-brand-green group-hover:text-brand-green ${
                      (link.href === '/' && location.pathname === '/') || (link.href !== '/' && location.pathname.startsWith(link.href)) 
                        ? 'border-brand-green text-brand-green' 
                        : 'border-transparent text-gray-900'
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={16} className="ml-2 group-hover:rotate-180 transition-transform duration-200" />}
                  </Link>
                  
                  {/* Dropdown */}
                  {link.hasDropdown && (
                    <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                      <div className="py-2">
                        {link.dropdownItems?.map((item) => (
                          <Link 
                            key={item.href} 
                            to={item.href} 
                            className={`block px-6 py-3 text-sm font-bold hover:text-brand-green hover:bg-brand-gray transition-colors border-b border-gray-50 last:border-0 ${location.pathname === item.href ? 'text-brand-green bg-brand-gray' : 'text-gray-700'}`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile Nav Drawer */}
        <div className={`lg:hidden bg-white border-t border-gray-100 absolute w-full transition-all duration-300 ease-in-out origin-top ${mobileMenuOpen ? 'scale-y-100 opacity-100 shadow-xl' : 'scale-y-0 opacity-0'} max-h-[85vh] overflow-y-auto`}>
          <div className="flex flex-col p-4 sm:p-6 space-y-1.5">
            {navLinks.map((link) => (
              <div key={link.name} className="border-none last:border-0">
                <div className="flex flex-col">
                  {link.hasDropdown ? (
                    <>
                      <button 
                        onClick={(e) => toggleMenu(link.name, e)}
                        className={`w-full flex items-center justify-between py-3.5 px-3 rounded-xl font-bold hover:text-brand-green text-[15px] tracking-tight uppercase text-left transition-colors min-h-[46px] hover:bg-gray-50 ${
                          (link.href === '/' && location.pathname === '/') || (link.href !== '/' && location.pathname.startsWith(link.href)) 
                            ? 'text-brand-green bg-brand-green/5' 
                            : 'text-gray-900'
                        }`}
                      >
                        {link.name}
                        <ChevronDown size={20} className={`transition-transform duration-200 ${expandedMenus[link.name] ? 'rotate-180 text-brand-green' : 'text-gray-400'}`} />
                      </button>
                      <div className={`pl-4 space-y-1 border-l-2 border-brand-green/20 ml-5 overflow-hidden transition-all duration-300 ${expandedMenus[link.name] ? 'max-h-[500px] py-2 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                        {link.dropdownItems?.map((item) => (
                          <Link 
                            key={item.href} 
                            to={item.href} 
                            className={`block py-3 px-4 rounded-lg font-semibold hover:text-brand-green transition-colors text-sm hover:bg-gray-50 ${location.pathname === item.href ? 'text-brand-green bg-brand-green/5' : 'text-gray-700'}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link 
                      to={link.href}
                      className={`block py-3.5 px-3 rounded-xl font-bold hover:text-brand-green text-[15px] tracking-tight uppercase transition-colors min-h-[46px] hover:bg-gray-50 ${
                        (link.href === '/' && location.pathname === '/') || (link.href !== '/' && location.pathname.startsWith(link.href)) 
                          ? 'text-brand-green bg-brand-green/5' 
                          : 'text-gray-900'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex flex-col gap-3 sm:gap-4 pt-5 sm:pt-6">
              <Link 
                to="/store-locator" 
                className="flex items-center justify-center border-2 border-brand-green text-brand-green py-3 px-6 rounded-2xl font-bold hover:bg-brand-green hover:text-white transition-colors uppercase text-sm tracking-wider min-h-[46px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin size={20} className="mr-2" /> Find Store
              </Link>
              <a 
                href="tel:+919457002000" 
                className="flex items-center justify-center border border-gray-300 text-gray-900 py-3 px-6 rounded-2xl font-bold hover:border-brand-green hover:text-brand-green transition-colors uppercase text-sm tracking-wider min-h-[46px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone size={20} className="mr-2" /> Support
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
