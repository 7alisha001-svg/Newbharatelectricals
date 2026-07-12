import { motion } from 'motion/react';
import { Building, Warehouse, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function LocationsPreview() {
  const { settings } = useStore();

  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 uppercase tracking-tight mb-6">
            Our Locations
          </h2>
          <div className="w-20 h-1.5 bg-brand-green mx-auto mb-8" />
          <p className="text-gray-800 max-w-2xl mx-auto text-lg md:text-xl font-medium tracking-wide">
            Visit our corporate office or warehouse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Office Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="w-16 h-16 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green flex-shrink-0">
              <Building size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Corporate Office</h3>
              <p className="text-gray-800 mb-4 line-clamp-2 text-lg font-medium tracking-wide">
                {settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.address || 
                 settings?.office_address || 
                 'Near Dr Amar Singh, Chaudhry Sarai, Budaun'}
              </p>
              <a 
                href={settings?.social_links?.locations?.find((l: any) => l.type === 'office')?.map_link || 'https://maps.google.com/?q=New+Bharat+Electricals,Budaun'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-brand-green font-bold hover:text-brand-green-dark transition-colors"
              >
                Get Directions <MapPin size={16} className="ml-2" />
              </a>
            </div>
          </motion.div>

          {/* Warehouse Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <div className="w-16 h-16 bg-brand-dark/5 rounded-xl flex items-center justify-center text-brand-dark flex-shrink-0">
              <Warehouse size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Warehouse</h3>
              <p className="text-gray-800 mb-4 line-clamp-2 text-lg font-medium tracking-wide">
                {settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.address || 
                 settings?.warehouse_address || 
                 'Budaun, Loda Bahedi, Uttar Pradesh'}
              </p>
              <a 
                href={settings?.social_links?.locations?.find((l: any) => l.type === 'warehouse')?.map_link || 'https://maps.google.com/?q=Loda+Bahedi,Budaun'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-brand-green font-bold hover:text-brand-green-dark transition-colors"
              >
                Get Directions <MapPin size={16} className="ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
