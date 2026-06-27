import { Phone, MessageCircle, ChevronDown, Menu, X, Zap, Heart, User, MapPin, Search, ShoppingCart, Store, Headset } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mainNavLinks as navLinks } from '../data/navigation';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Bar - Vijay Sales Style (Red Background) */}
      <div className="bg-brand-green text-white hidden md:block text-xs font-medium py-2">
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

      <header className={`sticky w-full top-0 z-50 transition-all duration-300 bg-white border-b border-gray-200 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8 pt-4 pb-0">
          {/* Main Header / Logo / Search / Icons */}
          <div className="flex items-center justify-between gap-4 mb-3">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 mr-3 bg-brand-green rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-green/20 group-hover:-translate-y-0.5 transition-transform">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-heading font-bold text-gray-900 leading-none tracking-tight">
                    New Bharat <span className="text-brand-green">Electricals</span>
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold text-gray-500 tracking-wider uppercase mt-1">
                    Powered By Trust
                  </span>
                </div>
              </Link>
            </div>

            {/* Location Selector */}
            <div className="hidden xl:flex items-center text-sm lg:pr-2">
              <MapPin size={24} className="text-gray-800 mr-2" strokeWidth={1.5} />
              <div className="flex flex-col leading-tight">
                <span className="text-gray-500 text-[11px]">Deliver to</span>
                <span className="font-bold text-gray-900 text-xs border-b border-gray-900 hover:text-brand-green hover:border-brand-green cursor-pointer transition-colors pb-0.5">Select your location</span>
              </div>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden lg:flex flex-grow max-w-[700px] relative">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-500" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for Inverters, Batteries, Solar Panels..." 
                  className="w-full bg-[#f1f1f1] border-none text-gray-900 text-sm rounded-full pl-12 pr-4 py-3 outline-none focus:bg-[#e5e5e5] transition-colors"
                />
              </div>
            </div>

            {/* Right Side Icons (Retail Style) */}
            <div className="hidden lg:flex flex-shrink-0 items-center space-x-6 text-gray-800 ml-4">
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
            <div className="flex items-center lg:hidden space-x-4">
              <button className="text-gray-800 hover:text-brand-green">
                <Search size={24} />
              </button>
              <Link to="/cart" className="text-gray-800 hover:text-brand-green relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-brand-green text-white text-[9px] font-bold rounded-full flex items-center justify-center -mt-2 -mr-2">{cartCount}</span>}
              </Link>
              <button 
                className="text-gray-800 hover:text-brand-green transition-colors p-1 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Desktop Categories Bottom Bar */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center space-x-8 text-[13px] font-bold uppercase tracking-wide">
              {navLinks.map((link) => (
                <li key={link.name} className="relative group">
                  <Link 
                    to={link.href} 
                    className="flex items-center text-gray-800 hover:text-brand-green transition-colors py-3 border-b-2 border-transparent group-hover:border-brand-green"
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} className="ml-1.5 group-hover:rotate-180 transition-transform duration-200" />}
                  </Link>
                  
                  {/* Dropdown */}
                  {link.hasDropdown && (
                    <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                      <div className="py-2">
                        {link.dropdownItems?.map((item) => (
                          <Link 
                            key={item.href} 
                            to={item.href} 
                            className="block px-4 py-2.5 text-xs text-gray-700 font-bold hover:text-brand-green hover:bg-brand-gray transition-colors border-b border-gray-50 last:border-0"
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
          <div className="flex flex-col p-6 space-y-3">
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-gray-100 last:border-0">
                <div className="flex flex-col">
                  {link.hasDropdown ? (
                    <>
                      <Link 
                        to={link.href}
                        className="block py-3 text-gray-900 font-bold hover:text-brand-green text-[15px] tracking-tight uppercase"
                      >
                        {link.name}
                      </Link>
                      <div className="pl-4 pb-4 space-y-2 border-l-2 border-brand-green-light ml-2">
                        {link.dropdownItems?.map((item) => (
                          <Link 
                            key={item.href} 
                            to={item.href} 
                            className="block py-2 pl-4 text-gray-600 font-medium hover:text-brand-green transition-colors text-sm"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link 
                      to={link.href}
                      className="block py-3 text-gray-900 font-bold hover:text-brand-green text-[15px] tracking-tight uppercase"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex flex-col gap-4 pt-6">
              <Link 
                to="/store-locator" 
                className="flex items-center justify-center border-2 border-brand-green text-brand-green py-3 rounded-lg font-bold hover:bg-brand-green hover:text-white transition-colors uppercase text-sm tracking-wider"
              >
                <MapPin size={18} className="mr-2" /> Find Store
              </Link>
              <a 
                href="tel:+919457002000" 
                className="flex items-center justify-center border border-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:border-brand-green hover:text-brand-green transition-colors uppercase text-sm tracking-wider"
              >
                <Phone size={18} className="mr-2" /> Support
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
