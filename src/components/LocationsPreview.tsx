import { motion } from 'motion/react';
import { Building, Building2, MapPin, Warehouse } from 'lucide-react';

interface LocationCardProps {
  icon: React.ReactNode;
  title: string;
  companyName: string;
  address: string;
  mapUrl: string;
  openMapsUrl: string;
}

function LocationCard({ icon, title, companyName, address, mapUrl, openMapsUrl }: LocationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-8"
    >
      <div className="flex flex-col gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="mb-2 text-2xl font-black text-gray-900">
            {title}
          </h3>

          <p className="mb-2 text-base font-semibold tracking-wide text-brand-green">
            {companyName}
          </p>

          <p className="mb-4 text-lg font-medium tracking-wide text-gray-900 whitespace-pre-line">
            {address}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
        <iframe
          src={mapUrl}
          title={`${title} map`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-48 w-full border-0"
        />
      </div>

      <a
        href={openMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2.5 font-bold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
      >
        Open in Maps <MapPin size={16} className="ml-2" />
      </a>
    </motion.article>
  );
}

export default function LocationsPreview() {
  const locations = [
  {
  title: 'Head Office',
  companyName: 'NEW BHARAT ELECTRICALS',
  address: 'Near Dr Amar Singh,\nChaudhary Saray Lalpul Road,\nBudaun HO, Budaun – 243601,\nUttar Pradesh, India',
  mapUrl: 'https://www.google.com/maps?q=Near+Dr+Amar+Singh,+Chaudhary+Saray+Lalpul+Road,+Budaun+243601,+Uttar+Pradesh,+India&output=embed',
  openMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Near+Dr+Amar+Singh,+Chaudhary+Saray+Lalpul+Road,+Budaun+243601,+Uttar+Pradesh,+India',
  icon: <Building size={28} />
 },
    {
      title: 'Branch Office',
      companyName: 'NEW BHARAT ELECTRICALS',
      address: 'Kargaina Market,\nOpp. Bharat Motors,\nChaupla Road,\nBareilly - 243001,\nUttar Pradesh, India',
      mapUrl: 'https://www.google.com/maps?q=Kargaina+Market%2C+Opp.+Bharat+Motors%2C+Chaupla+Road%2C+Bareilly+243001%2C+Uttar+Pradesh%2C+India&output=embed',
      openMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kargaina+Market%2C+Opp.+Bharat+Motors%2C+Chaupla+Road%2C+Bareilly+243001%2C+Uttar+Pradesh%2C+India',
      icon: <Building2 size={28} />
    },
    {
      title: 'Warehouse',
      companyName: 'NEW BHARAT ELECTRICALS',
      address: 'Loda Bahedi,\nBudaun,\nUttar Pradesh – 243601,\nIndia',
      mapUrl: 'https://www.google.com/maps?q=Loda+Bahedi%2C+Budaun%2C+Uttar+Pradesh+243601%2C+India&output=embed',
      openMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Loda+Bahedi%2C+Budaun%2C+Uttar+Pradesh+243601%2C+India',
      icon: <Warehouse size={28} />
    }
  ];

  return (
        <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-6 xl:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-green">
            Our Locations
          </p>
          <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Visit our offices and service points
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.title} {...location} />
          ))}
        </div>
      </div>
    </section>
  );
}