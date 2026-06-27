import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoBanners from '../components/PromoBanners';
import TrendingProducts from '../components/TrendingProducts';
import About from '../components/About';
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <PromoBanners />
      <TrendingProducts />
      <Testimonials />
      <WhyUs />
      <About />
    </>
  );
}
