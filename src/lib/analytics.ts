/**
 * Production-ready SEO Analytics and Conversion Tracker
 * Integrates Google Analytics 4 (GA4), Google Tag Manager (GTM), Microsoft Clarity, and Meta Pixel.
 * Tracks custom events to optimize conversion rate (CRO) and crawlability.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

const GA_ID = 'G-P6X6NL6Z77'; // Example Production Measurement ID
const FB_PIXEL_ID = '1234567890'; // Example Meta Pixel ID

/**
 * Initialize all analytics scripts dynamically on production
 */
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  // Initialize GTM & GA4 Data Layer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  // Load GA4 Script
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gaScript);

  // Load Meta Pixel Script
  try {
    window.fbq = function () {
      if (window.fbq) {
        // @ts-ignore
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
      }
    };
    // @ts-ignore
    if (!window._fbq) window._fbq = window.fbq;
    // @ts-ignore
    window.fbq.push = window.fbq;
    // @ts-ignore
    window.fbq.loaded = true;
    // @ts-ignore
    window.fbq.version = '2.0';
    // @ts-ignore
    window.fbq.queue = [];
    
    const fbScript = document.createElement('script');
    fbScript.async = true;
    fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(fbScript);

    window.fbq('init', FB_PIXEL_ID);
    window.fbq('track', 'PageView');
  } catch (err) {
    console.warn('Meta Pixel failed to initialize', err);
  }

  // Load Microsoft Clarity
  try {
    const clarityId = 'clarity-project-id';
    const clarityScript = document.createElement('script');
    clarityScript.async = true;
    clarityScript.innerHTML = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");`;
    document.head.appendChild(clarityScript);
  } catch (err) {
    console.warn('Microsoft Clarity failed to initialize', err);
  }
};

/**
 * Track page views dynamically
 */
export const trackPageView = (path: string) => {
  if (typeof window === 'undefined') return;

  // Track Google Analytics
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  }

  // Track Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track custom conversion event (e.g. lead capture form, quote popup, contact form)
 */
export const trackLeadSubmission = (formName: string, inquiryType: string) => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      form_name: formName,
      inquiry_type: inquiryType,
      value: 100, // estimated lead value
      currency: 'INR',
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: formName,
      content_category: inquiryType,
    });
  }
};

/**
 * Track CTA interactions (WhatsApp clicks, click-to-call)
 */
export const trackCTAInteraction = (ctaType: 'whatsapp' | 'phone' | 'email', location: string) => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_type: ctaType,
      location: location,
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Contact', {
      content_name: ctaType,
      content_category: location,
    });
  }
};

/**
 * Track eCommerce actions: Add to Cart
 */
export const trackAddToCart = (product: { id: string; name: string; price: number; category: string }) => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        quantity: 1,
      }]
    });
  }

  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'INR',
    });
  }
};

/**
 * Track eCommerce actions: Begin Checkout
 */
export const trackBeginCheckout = (cartItems: any[], totalValue: number) => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      value: totalValue,
      currency: 'INR',
      items: cartItems.map(item => ({
        item_id: item.product?.id || item.id,
        item_name: item.product?.name || item.name,
        price: item.product?.sale_price || item.product?.regular_price || item.price,
        quantity: item.quantity,
      }))
    });
  }

  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: totalValue,
      currency: 'INR',
      num_items: cartItems.length,
    });
  }
};

/**
 * Track eCommerce actions: Purchase Complete
 */
export const trackPurchase = (orderId: string, value: number, items: any[]) => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value: value,
      currency: 'INR',
      items: items.map(item => ({
        item_id: item.product_id || item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: 'INR',
      content_type: 'product',
      order_id: orderId,
    });
  }
};
