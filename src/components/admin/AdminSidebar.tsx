import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Archive, 
  Flag, Users, Settings, LogOut, X, Navigation as NavIcon, MapPin,
  Zap, Sun, FileSpreadsheet, MessageCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../context/StoreContext';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Inventory', href: '/admin/inventory', icon: Archive },
  { name: 'Brands', href: '/admin/brands', icon: Flag },
  { name: 'Brand Slider', href: '/admin/brand-slider', icon: Flag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Quotes', href: '/admin/quotes', icon: MessageCircle },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Navigation', href: '/admin/navigation', icon: NavIcon },
  { name: 'Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Google Sheets', href: '/admin/sheets', icon: FileSpreadsheet },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const powerCategories = [
  { name: 'Inverters', href: '/admin/power-solutions/inverters' },
  { name: 'Batteries', href: '/admin/power-solutions/batteries' },
  { name: '3-Phase Inverters', href: '/admin/power-solutions/3-phase-inverters' },
  { name: 'Lift Inverters', href: '/admin/power-solutions/lift-inverters' },
  { name: 'Combo Products', href: '/admin/power-solutions/combo-products' },
];

const solarCategories = [
  { name: 'Solar On-Grid Inverter', href: '/admin/solar-solutions/solar-on-grid-inverters' },
  { name: 'Solar Off-Grid Inverter', href: '/admin/solar-solutions/solar-off-grid-inverters' },
  { name: 'Solar Hybrid Inverter', href: '/admin/solar-solutions/solar-hybrid-inverters' },
  { name: 'Solar Panel', href: '/admin/solar-solutions/solar-panels' },
  { name: 'Solar Batteries', href: '/admin/solar-solutions/solar-batteries' },
  { name: 'Solar Charge Controller', href: '/admin/solar-solutions/solar-charge-controllers' },
];

export default function AdminSidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean, 
  setIsOpen: (v: boolean) => void 
}) {
  const { settings } = useStore();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('admin_users').select('*').eq('id', user.id).single();
        setAdminUser(data);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-gray-900 text-white w-64 z-50 transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between py-3 px-5 border-b border-gray-800">
          <Link to="/" className="flex items-center hover:opacity-100 transition-opacity p-0 m-0 overflow-visible">
            <img 
              src={settings?.social_links?.footer_logo || "/footer-logo-light.png"} 
              alt={settings?.business_name || "New Bharat Electricals"} 
              className="h-[64px] w-auto object-contain scale-[1.25] transform-gpu origin-left -my-1 -mx-0.5 filter drop-shadow-md" 
              onError={(e) => { 
                const target = e.currentTarget; 
                if (!target.src.includes('images.unsplash.com')) {
                  target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; 
                }
              }} 
            />
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-2">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          {/* General Section */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">General</p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-6 py-3.5 text-xs font-semibold rounded-xl transition-colors
                    ${isActive 
                      ? 'bg-brand-green text-white font-bold' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={16} className={`mr-2.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Power Solution Section */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Power Solution</p>
            {powerCategories.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-6 py-3.5 text-xs font-semibold rounded-xl transition-colors
                    ${isActive 
                      ? 'bg-brand-green text-white font-bold' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Zap size={14} className={`mr-2.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Solar Solution Section */}
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Solar Solution</p>
            {solarCategories.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-6 py-3.5 text-xs font-semibold rounded-xl transition-colors
                    ${isActive 
                      ? 'bg-brand-green text-white font-bold' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Sun size={14} className={`mr-2.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-white truncate">{adminUser?.full_name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{adminUser?.email || 'Loading...'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
