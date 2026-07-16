import { Routes, Route, BrowserRouter, Outlet } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import Home from './pages/Home';
import GenericCategoryPage from './pages/GenericCategoryPage';
import GenericSubCategoryPage from './pages/GenericSubCategoryPage';
import ProductPage from './pages/ProductPage';
import Catalogue from './pages/Catalogue';
import StoreLocator from './pages/StoreLocator';
import Contact from './pages/Contact';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AboutUsPage from './pages/AboutUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import BrandPage from './pages/BrandPage';
import ScrollToTop from './components/ScrollToTop';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Inventory from './pages/admin/Inventory';
import Categories from './pages/admin/Categories';
import CategoryForm from './pages/admin/CategoryForm';
import Brands from './pages/admin/Brands';
import BrandSliderAdmin from './pages/admin/BrandSliderAdmin';
import BrandForm from './pages/admin/BrandForm';
import Customers from './pages/admin/Customers';
import Quotes from './pages/admin/Quotes';
import Settings from './pages/admin/Settings';
import Locations from './pages/admin/Locations';
import Navigation from './pages/admin/Navigation';
import CategoryProductManager from './pages/admin/CategoryProductManager';
import GoogleSheetsPage from './pages/admin/GoogleSheetsPage';

import { useStore, StoreProvider } from './context/StoreContext';


const GlobalHead = () => {
  const { settings } = useStore();
  return (
      <Helmet>
        <title>{settings?.business_name || 'New Bharat Electricals'} | Trusted Solar & Electrical Solutions</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="description" content="New Bharat Electricals provides high-quality solar solutions, inverters, batteries, and home electrical products. Powering every home and business with durable and efficient electrical systems." />
        <meta name="keywords" content="solar panels, inverters, batteries, electrical accessories, new bharat electricals, Buduan" />
      </Helmet>
  );
};

const PublicLayout = () => (

  <div className="min-h-screen top-0 bg-white selection:bg-brand-green selection:text-white flex flex-col">
    <Navbar />
    <main className="flex-grow pt-24">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFab />
  </div>
);

export default function App() {
  
  return (
    <HelmetProvider>
      
      <StoreProvider>
        <GlobalHead />
        <CartProvider>
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/new" element={<CategoryForm />} />
              <Route path="categories/:id/edit" element={<CategoryForm />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/new" element={<BrandForm />} />
              <Route path="brands/:id/edit" element={<BrandForm />} />
              <Route path="brand-slider" element={<BrandSliderAdmin />} />
              <Route path="customers" element={<Customers />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="navigation" element={<Navigation />} />
              <Route path="settings" element={<Settings />} />
              <Route path="locations" element={<Locations />} />
              <Route path="sheets" element={<GoogleSheetsPage />} />
              <Route path="power-solutions/:subcategory" element={<CategoryProductManager />} />
              <Route path="solar-solutions/:subcategory" element={<CategoryProductManager />} />
            </Route>

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
              <Route path="/brands/:brandSlug" element={<BrandPage />} />
              <Route path="/:category" element={<GenericCategoryPage />} />
              <Route path="/:category/:subcategory" element={<GenericSubCategoryPage />} />
              <Route path="/:category/:subcategory/:productId" element={<ProductPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </StoreProvider>
    </HelmetProvider>
  );
}
