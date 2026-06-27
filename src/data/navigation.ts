export const categoryNav: Record<string, {name: string, slug: string}[]> = {
  'power-solutions': [
    { name: 'UPS Systems', slug: 'ups-systems' },
    { name: 'Home Inverters', slug: 'home-inverters' },
    { name: 'Industrial Inverters', slug: 'industrial-inverters' },
    { name: 'Battery Backup Systems', slug: 'battery-backup-systems' },
    { name: 'Power Backup Solutions', slug: 'power-backup-solutions' },
  ],
  'solar-solutions': [
    { name: 'Residential Solar Panels', slug: 'residential-solar-panels' },
    { name: 'Commercial Solar Panels', slug: 'commercial-solar-panels' },
    { name: 'Industrial Solar Projects', slug: 'industrial-solar-projects' },
    { name: 'Solar Inverters', slug: 'solar-inverters' },
    { name: 'Solar Battery Storage', slug: 'solar-battery-storage' },
    { name: 'Solar Installation Services', slug: 'solar-installation-services' },
    { name: 'Rooftop Solar Solutions', slug: 'rooftop-solar-solutions' },
  ],
  'mobility-solutions': [
    { name: 'E-Rickshaw Batteries', slug: 'e-rickshaw-batteries' },
    { name: 'EV Battery Solutions', slug: 'ev-battery-solutions' },
    { name: 'Charging Support', slug: 'charging-support' },
    { name: 'Automotive Battery Solutions', slug: 'automotive-battery-solutions' },
  ],
  'accessories': [
    { name: 'Solar Connectors', slug: 'solar-connectors' },
    { name: 'Wiring Accessories', slug: 'wiring-accessories' },
    { name: 'Electrical Cables', slug: 'electrical-cables' },
    { name: 'Switches', slug: 'switches' },
    { name: 'Installation Accessories', slug: 'installation-accessories' },
    { name: 'Battery Accessories', slug: 'battery-accessories' },
  ]
};

export const mainNavLinks = [
  { name: 'Home', href: '/' },
  { 
    name: 'Power Solutions', 
    href: '/power-solutions',
    hasDropdown: true,
    dropdownItems: categoryNav['power-solutions'].map(item => ({ name: item.name, href: `/power-solutions/${item.slug}` }))
  },
  { 
    name: 'Solar Solutions', 
    href: '/solar-solutions',
    hasDropdown: true,
    dropdownItems: categoryNav['solar-solutions'].map(item => ({ name: item.name, href: `/solar-solutions/${item.slug}` }))
  },
  { 
    name: 'Mobility Solutions', 
    href: '/mobility-solutions',
    hasDropdown: true,
    dropdownItems: categoryNav['mobility-solutions'].map(item => ({ name: item.name, href: `/mobility-solutions/${item.slug}` }))
  },
  { name: 'Store Locator', href: '/store-locator' },
  { name: 'Catalogue', href: '/catalogue' },
  { 
    name: 'Accessories', 
    href: '/accessories',
    hasDropdown: true,
    dropdownItems: categoryNav['accessories'].map(item => ({ name: item.name, href: `/accessories/${item.slug}` }))
  },
  { name: 'Contact', href: '/contact' }
];
