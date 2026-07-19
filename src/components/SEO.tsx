import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'product' | 'article' | 'business';
  ogImage?: string;
  schemaType?: 'Organization' | 'LocalBusiness' | 'Product' | 'Service' | 'FAQPage' | 'BreadcrumbList' | 'WebPage';
  schemaData?: any;
  faqData?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
  productData?: {
    name: string;
    description: string;
    sku: string;
    image: string;
    price: number;
    currency?: string;
    brand: string;
    availability?: 'InStock' | 'OutOfStock';
    ratingValue?: number;
    reviewCount?: number;
  };
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/public/header-logo-dark.png',
  schemaType,
  schemaData,
  faqData,
  breadcrumbs,
  productData,
}) => {
  const { settings } = useStore();

  const businessName = settings?.business_name || 'New Bharat Electricals';
  const defaultDesc = settings?.office_address 
    ? `New Bharat Electricals is a leading premium solar panels, inverters, and electrical components distributor and contractor in ${settings.office_address}.`
    : 'New Bharat Electricals provides high-efficiency solar panels, power inverters, long-lasting batteries, electrical panels, cabling, and turnkey electrical contractor services.';
  
  const siteUrl = 'https://newbharatelectricals.com';
  const currentUrl = canonicalUrl || typeof window !== 'undefined' ? window.location.href : siteUrl;
  
  const metaTitle = title 
    ? `${title} | ${businessName}` 
    : `${businessName} | Solar Solutions, Inverters & Electrical Contractor Budaun`;

  const metaDesc = description || defaultDesc;
  const metaKeywords = keywords 
    ? `${keywords}, electrical contractor, solar energy, Budaun, India, inverters, batteries, New Bharat` 
    : 'solar panel installer Budaun, electrical contractor India, AMC electrical panel installation, inverter batteries, backup power solutions, premium industrial wiring Budaun, New Bharat Electricals';

  // Base Schema Objects
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    'name': businessName,
    'url': siteUrl,
    'logo': `${siteUrl}/public/header-logo-dark.png`,
    'email': settings?.email || 'contact@newbharatelectricals.com',
    'telephone': settings?.phone || '+91 94122 81475',
    'sameAs': [
      ...(settings?.social_links?.facebook ? [settings.social_links.facebook] : []),
      ...(settings?.social_links?.twitter ? [settings.social_links.twitter] : []),
      ...(settings?.social_links?.linkedin ? [settings.social_links.linkedin] : []),
      ...(settings?.social_links?.instagram ? [settings.social_links.instagram] : []),
    ]
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    '@id': `${siteUrl}/#localbusiness`,
    'name': businessName,
    'image': [
      `${siteUrl}/public/images/amaze-an-star-1475-1.jpg`,
      `${siteUrl}/public/header-logo-dark.png`
    ],
    'url': siteUrl,
    'telephone': settings?.phone || '+91 94122 81475',
    'priceRange': '₹₹',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings?.office_address || 'Near Police Line, Budaun Bypass Rd',
      'addressLocality': 'Budaun',
      'addressRegion': 'Uttar Pradesh',
      'postalCode': '243601',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 28.0515,
      'longitude': 79.1275
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        'opens': '09:00',
        'closes': '20:00'
      }
    ],
    'areaServed': [
      { '@type': 'AdministrativeArea', 'name': 'Budaun' },
      { '@type': 'AdministrativeArea', 'name': 'Bareilly' },
      { '@type': 'AdministrativeArea', 'name': 'Uttar Pradesh' },
      { '@type': 'AdministrativeArea', 'name': 'Delhi NCR' }
    ]
  };

  const finalSchemas: any[] = [organizationSchema, localBusinessSchema];

  // Breadcrumb List Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`
      }))
    };
    finalSchemas.push(breadcrumbSchema);
  }

  // FAQ Schema
  if (faqData && faqData.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqData.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    };
    finalSchemas.push(faqSchema);
  }

  // Product Schema
  if (productData) {
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': productData.name,
      'image': productData.image,
      'description': productData.description || metaDesc,
      'sku': productData.sku,
      'mpn': productData.sku,
      'brand': {
        '@type': 'Brand',
        'name': productData.brand
      },
      'offers': {
        '@type': 'Offer',
        'url': currentUrl,
        'priceCurrency': productData.currency || 'INR',
        'price': productData.price,
        'priceValidUntil': '2030-12-31',
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': productData.availability === 'OutOfStock' 
          ? 'https://schema.org/OutOfVolume' 
          : 'https://schema.org/InStock',
        'seller': {
          '@type': 'LocalBusiness',
          'name': businessName
        }
      }
    };

    if (productData.ratingValue && productData.reviewCount) {
      Object.assign(productSchema, {
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': productData.ratingValue,
          'reviewCount': productData.reviewCount,
          'bestRating': '5',
          'worstRating': '1'
        }
      });
    }
    finalSchemas.push(productSchema);
  }

  // Handle specific user-provided custom schema
  if (schemaType && schemaData) {
    finalSchemas.push({
      '@context': 'https://schema.org',
      '@type': schemaType,
      ...schemaData
    });
  }

  // AI Search Engine Entities Context Mapping (GEO optimization)
  // This provides machine-readable labels that AI engines (e.g. Perplexity, Gemini, ChatGPT) can easily parse.
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="New Bharat Electricals" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Indexing instructions for standard & AI Crawlers */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large" />
      <meta name="bingbot" content="index, follow" />

      {/* Open Graph Tags for Social Media & Chat Platforms (Discord, WhatsApp, Slack) */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content={businessName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />

      {/* GEO & Entity SEO Context Identifiers for Large Language Models */}
      <meta name="ai-agent-target" content="electrical-contractor, solar-energy-provider, power-inverters-distributor" />
      <meta name="knowledge-graph-topic" content="Solar energy, Electrical engineering, Electric power distribution, Uninterruptible power supply" />
      <meta name="geotarget" content="Budaun, Uttar Pradesh, India, Bareilly, Delhi NCR" />
      <meta name="eeat-verified" content="Mazhar Hussain (Founder), Registered Electrical Contractor" />

      {/* Render all assembled JSON-LD Structured Data */}
      {finalSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
