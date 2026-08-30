import { useMedia } from '../context/MediaContext';
import { useState } from 'react';

export default function Hero() {
  const { getMediaUrl, getMediaAlt } = useMedia();
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = '/images/amaze-an-star-1475-1.jpg';
  const dbSrc = getMediaUrl('hero_banner_1', fallbackSrc);
  const src = hasError ? fallbackSrc : (dbSrc || fallbackSrc);
  const alt = getMediaAlt('hero_banner_1', 'New Bharat Electricals - Solar & Power Solutions');

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#f4f4f4] border-none">
      <div className="relative w-full h-auto min-h-[280px] sm:min-h-[360px] md:h-[500px] lg:h-[550px]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center block"
          loading="eager"
          onError={handleError}
        />
      </div>
    </section>
  );
}
