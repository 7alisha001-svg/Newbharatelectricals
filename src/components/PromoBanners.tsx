import { Link } from 'react-router-dom';

export default function PromoBanners() {
  return (
    <section className="py-6 md:py-8 bg-white border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link to="/solar-solutions" className="block relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent z-10 p-4 sm:p-6 md:p-8 flex flex-col justify-center w-[85%] sm:w-3/4 md:w-2/3">
              <span className="text-white bg-brand-green font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 sm:mb-2 w-fit px-2 sm:px-3 py-1 sm:py-1.5 rounded inline-block shadow-sm">Special Offer</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white drop-shadow-md mb-1.5 sm:mb-2 leading-tight">Upgrade to Solar Power</h3>
              <p className="text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4">Get up to 20% off on residential panels</p>
              <div className="mt-auto inline-block bg-brand-green text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded hover:bg-green-600 transition-colors w-max font-bold text-xs sm:text-sm">
                Shop Solar &rarr;
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop" 
              alt="Solar Promotion" 
              className="w-full h-40 sm:h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
          </Link>
          
          <Link to="/power-solutions" className="block relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent z-10 p-4 sm:p-6 md:p-8 flex flex-col justify-center w-[85%] sm:w-3/4 md:w-2/3">
              <span className="text-white bg-blue-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 sm:mb-2 w-fit px-2 sm:px-3 py-1 sm:py-1.5 rounded inline-block shadow-sm">Best Seller</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white drop-shadow-md mb-1.5 sm:mb-2 leading-tight">Never Lose Power</h3>
              <p className="text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4">Premium inverters with 5-year warranty</p>
              <div className="mt-auto inline-block bg-white text-blue-900 px-4 sm:px-5 py-2 sm:py-2.5 rounded hover:bg-gray-100 transition-colors w-max font-bold text-xs sm:text-sm">
                Explore Batteries &rarr;
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop" 
              alt="Inverter Promotion" 
              className="w-full h-40 sm:h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; e.currentTarget.onerror = null; }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
