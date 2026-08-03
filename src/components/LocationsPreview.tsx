import { motion } from 'motion/react';
import { Building, MapPin } from 'lucide-react';

export default function LocationsPreview() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-green">
            Our Locations
          </p>
          <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Visit our offices and service points
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md sm:p-8"
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <Building size={32} />
            </div>

            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-black text-gray-900">
                Corporate Office - Bareilly
              </h3>

              <p className="mb-4 text-lg font-medium tracking-wide text-gray-900">
                New Bharat Electricals<br />
                Kargaina Market,<br />
                Opp. Bharat Motors,<br />
                Chaupla Road,<br />
                Bareilly – 243001,<br />
                Uttar Pradesh
              </p>

              <a
                href="https://maps.app.goo.gl/X5cz7z5szyCcv5b3A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-bold text-brand-green transition-colors hover:text-brand-green-dark"
              >
                Get Directions <MapPin size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}