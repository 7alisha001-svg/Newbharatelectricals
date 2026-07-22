import ErrorBoundary from './components/ErrorBoundary';
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import Home from './pages/Home';
import { initAnalytics, trackPageView } from './lib/analytics';
const GenericCategoryPage = React.lazy(() => import('./pages/GenericCategoryPage'));
const GenericSubCategoryPage = React.lazy(() => import('./pages/GenericSubCategoryPage'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));
const Catalogue = React.lazy(() => import('./pages/Catalogue'));
const StoreLocator = React.lazy(() => import('./pages/StoreLocator'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = React.lazy(() => import('./pages/OrderSuccessPage'));
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsConditionsPage = React.lazy(() => import('./pages/TermsConditionsPage'));
const BrandPage = React.lazy(() => import('./pages/BrandPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const SEOReportPage = React.lazy(() => import('./pages/SEOReportPage'));
import ScrollToTop from './components/ScrollToTop';
import LeadCapturePopup from './components/LeadCapturePopup';

const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Orders = React.lazy(() => import('./pages/admin/Orders'));
const Products = React.lazy(() => import('./pages/admin/Products'));
const ProductForm = React.lazy(() => import('./pages/admin/ProductForm'));
const Inventory = React.lazy(() => import('./pages/admin/Inventory'));
const Categories = React.lazy(() => import('./pages/admin/Categories'));
const CategoryForm = React.lazy(() => import('./pages/admin/CategoryForm'));
const Brands = React.lazy(() => import('./pages/admin/Brands'));
const BrandSliderAdmin = React.lazy(() => import('./pages/admin/BrandSliderAdmin'));
const BrandForm = React.lazy(() => import('./pages/admin/BrandForm'));
const Customers = React.lazy(() => import('./pages/admin/Customers'));
const Quotes = React.lazy(() => import('./pages/admin/Quotes'));
const Leads = React.lazy(() => import('./pages/admin/Leads'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));
const Locations = React.lazy(() => import('./pages/admin/Locations'));
const Navigation = React.lazy(() => import('./pages/admin/Navigation'));
const CategoryProductManager = React.lazy(() => import('./pages/admin/CategoryProductManager'));
const GoogleSheetsPage = React.lazy(() => import('./pages/admin/GoogleSheetsPage'));

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

const PublicLayout = () => {
  const { settings, categories, brands, loading } = useStore();

  return (
    <div className="min-h-screen top-0 bg-white selection:bg-brand-green selection:text-white flex flex-col">
      <Navbar settings={settings} categories={categories} brands={brands} loading={loading} />
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <LeadCapturePopup />
    </div>
  );
};

const AnalyticsTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

export default function App() {
  useEffect(() => {
    initAnalytics();
    try {
      window.sessionStorage.removeItem('retry-chunk-error');
    } catch (e) {
      console.error(e);
    }
  }, []);
  
  return (
    <HelmetProvider>
      
      <StoreProvider>
        <GlobalHead />
        <CartProvider>
          <BrowserRouter>
          <AnalyticsTracker />
          <ScrollToTop />
          <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />
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
              <Route path="leads" element={<Leads />} />
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
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPage />} />
              <Route path="/seo-report" element={<SEOReportPage />} />
              <Route path="/:category" element={<GenericCategoryPage />} />
              <Route path="/:category/:subcategory" element={<GenericSubCategoryPage />} />
              <Route path="/:category/:subcategory/:productId" element={<ProductPage />} />
            </Route>
          </Routes>
          </Suspense>
        </BrowserRouter>
        </CartProvider>
      </StoreProvider>
    </HelmetProvider>
  );
}
