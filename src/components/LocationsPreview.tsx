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

function LocationCard({
  icon,
  title,
  companyName,
  address,
  mapUrl,
  openMapsUrl,
}: LocationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-md sm:p-8"
    >
      {/* Icon */}
      <div className="mb-4 flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-brand-green/10">
        {icon}
      </div>

      {/* Location Information */}
      <div className="flex flex-1 flex-col">
        {/* Fixed title area for consistent alignment */}
        <h3 className="mb-2 min-h-[30px] text-xl sm:min-h-[36px] sm:text-2xl font-black text-gray-900">
          {title}
        </h3>

        {/* Fixed company name area */}
        <p className="mb-2 min-h-[20px] text-sm sm:min-h-[24px] sm:text-base font-semibold tracking-wide text-brand-green">
          {companyName}
        </p>

        {/* Fixed address area */}
        <p className="mb-3 min-h-[100px] text-sm sm:mb-4 sm:min-h-[128px] sm:text-lg font-medium leading-relaxed tracking-wide text-gray-900 whitespace-pre-line">
          {address}
        </p>

        {/* Google Map */}
        <div className="mt-auto overflow-hidden rounded-xl border border-gray-200">
          <iframe
            src={mapUrl}
            title={`${title} map`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-40 sm:h-48 w-full border-0"
          />
        </div>

        {/* Open in Maps */}
        <a
          href={openMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 sm:mt-4 inline-flex h-12 sm:h-14 items-center justify-center rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2.5 font-bold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
        >
          Open in Maps
          <MapPin size={16} className="ml-2" />
        </a>
      </div>
    </motion.article>
  );
}

export default function LocationsPreview() {
  const locations: LocationCardProps[] = [
    {
      title: 'Head Office',
      companyName: 'NEW BHARAT ELECTRICALS',
      address:
        'Near Dr Amar Singh,\nChaudhary Saray Lalpul Road,\nBudaun HO, Budaun – 243601,\nUttar Pradesh, India',
      mapUrl:
        'https://www.google.com/maps?q=Near+Dr+Amar+Singh,+Chaudhary+Saray+Lalpul+Road,+Budaun+243601,+Uttar+Pradesh,+India&output=embed',
      openMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Near+Dr+Amar+Singh,+Chaudhary+Saray+Lalpul+Road,+Budaun+243601,+Uttar+Pradesh,+India',
      icon: <Building size={34} className="text-brand-green" />,
    },

    {
      title: 'Branch Office',
      companyName: 'NEW BHARAT ELECTRICALS',
      address:
        'Kargaina Market,\nOpp. Bharat Motors,\nChaupla Road,\nBareilly - 243001,\nUttar Pradesh, India',
      mapUrl:
        'https://www.google.com/maps?q=Kargaina+Market%2C+Opp.+Bharat+Motors%2C+Chaupla+Road%2C+Bareilly+243001%2C+Uttar+Pradesh%2C+India&output=embed',
      openMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Kargaina+Market%2C+Opp.+Bharat+Motors%2C+Chaupla+Road%2C+Bareilly+243001%2C+Uttar+Pradesh%2C+India',
      icon: <Building2 size={34} className="text-brand-green" />,
    },

    {
      title: 'Warehouse',
      companyName: 'NEW BHARAT ELECTRICALS',
      address:
        'New Bharat Electricals\nNational Highway 530B\nOpp. Florence Nightingale\nUjhani Road\nBadaun – 243601\nUttar Pradesh',
      mapUrl:
        'https://www.google.com/maps?q=New+Bharat+Electricals,+National+Highway+530B,+Opp.+Florence+Nightingale,+Ujhani+Road,+Badaun+243601,+Uttar+Pradesh,+India&output=embed',
      openMapsUrl:
        'https://www.google.com/maps/search/?api=1&query=New+Bharat+Electricals,+National+Highway+530B,+Opp.+Florence+Nightingale,+Ujhani+Road,+Badaun+243601,+Uttar+Pradesh,+India',
      icon: <Warehouse size={34} className="text-brand-green" />,
    },
  ];

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
        {/* Section Heading */}
        <div className="mb-6 md:mb-10 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900">
            Our Locations
          </h2>

          <p className="mt-1 md:mt-2 text-sm md:text-base font-medium text-gray-600">
            Visit our offices and service points
          </p>
        </div>

        {/* Location Cards */}
        <div className="grid items-stretch gap-3 md:gap-6 lg:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.title} {...location} />
          ))}
        </div>
      </div>
    </section>
  );
}