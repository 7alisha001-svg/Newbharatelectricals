import { useMedia } from '../context/MediaContext';

export default function Hero() {
  const { getMediaUrl } = useMedia();

  return (
    <section className="relative w-full overflow-hidden bg-[#f4f4f4] border-none">
      <div className="relative w-full h-auto min-h-[320px] sm:min-h-[420px] md:h-[550px] lg:h-[600px]">
        <img
          src={getMediaUrl('hero_banner_1', '/images/amaze-an-star-1475-1.jpg')}
          alt="New Bharat Electricals - Solar & Power Solutions"
          className="w-full h-full object-cover block"
          loading="eager"
        />
      </div>
    </section>
  );
}
