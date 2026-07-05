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

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';

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
      <Helmet>
        <title>New Bharat Electricals | Trusted Solar & Electrical Solutions</title>
        <meta name="description" content="New Bharat Electricals provides high-quality solar solutions, inverters, batteries, and home electrical products. Powering every home and business with durable and efficient electrical systems." />
        <meta name="keywords" content="solar panels, inverters, batteries, electrical accessories, new bharat electricals, Buduan" />
      </Helmet>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
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
    </HelmetProvider>
  );
}
