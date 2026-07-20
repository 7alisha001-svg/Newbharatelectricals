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
import { SEO } from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="Solar Panel Solutions, Inverters & Electrical Contractor Budaun"
        description="New Bharat Electricals is Budaun's leading licensed Class-A electrical contractor, authorized Amaze power inverters distributor, and premium solar panels installer. Contact us for turnkey industrial cabling, AMCs, and backup systems."
        keywords="solar panels Budaun, electrical contractor Bareilly, Amaze inverter batteries Uttar Pradesh, industrial switchgear installation, AMC electrical panel"
      />
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
