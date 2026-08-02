</motion.div>

{/* Corporate Office - Bareilly */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.2 }}
  className="bg-white rounded-2xl shadow-md border-none p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
>
  <div className="w-16 h-16 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green flex-shrink-0">
    <Building size={32} />
  </div>

  <div className="flex-1">
    <h3 className="text-2xl font-black text-gray-900 mb-2">
      Corporate Office - Bareilly
    </h3>

    <p className="text-gray-900 mb-4 text-lg font-medium tracking-wide">
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
      className="inline-flex items-center text-brand-green font-bold hover:text-brand-green-dark transition-colors"
    >
      Get Directions <MapPin size={16} className="ml-2" />
    </a>
  </div>
</motion.div>