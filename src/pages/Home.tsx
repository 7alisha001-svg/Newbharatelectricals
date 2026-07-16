import Hero from '../components/Hero';
import BrandsSection from '../components/BrandsSection';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoBanners from '../components/PromoBanners';
import TrendingProducts from '../components/TrendingProducts';
import About from '../components/About';
import WhyUs from '../components/WhyUs';
import CompanyStats from '../components/CompanyStats';
import Testimonials from '../components/Testimonials';
import LocationsPreview from '../components/LocationsPreview';

import QuotePopup from '../components/QuotePopup';

export default function Home() {
  return (
    <>
      <QuotePopup />
      <Hero />
      <BrandsSection />
      <FeaturedProducts />
      <PromoBanners />
      <TrendingProducts />
      <Testimonials />
      <WhyUs />
      <CompanyStats />
      <About />
      <LocationsPreview />
    </>
  );
}
