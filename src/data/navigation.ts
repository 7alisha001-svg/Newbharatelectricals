export const categoryNav: Record<string, {name: string, slug: string}[]> = {
  'mobility-solutions': [
    { name: 'E-Rickshaw Batteries', slug: 'e-rickshaw-batteries' },
    { name: 'EV Battery Solutions', slug: 'ev-battery-solutions' },
    { name: 'Charging Support', slug: 'charging-support' },
    { name: 'Automotive Battery Solutions', slug: 'automotive-battery-solutions' },
  ],
  'power-solutions': [
    { name: 'Inverters', slug: 'inverters' },
    { name: 'Batteries', slug: 'batteries' },
    { name: '3-Phase Inverters', slug: '3-phase-inverters' },
    { name: 'Lift Inverters', slug: 'lift-inverters' },
    { name: 'Combo Products', slug: 'combo-products' },
  ],
  'brands': [
    { name: 'Amaze', slug: 'amaze' },
    { name: 'Luminous', slug: 'luminous' },
    { name: 'Microtek', slug: 'microtek' },
  ]
};

export const mainNavLinks = [
  { name: 'Home', href: '/' },
  { 
    name: 'Power Solution', 
    href: '/power-solutions',
    hasDropdown: true,
    dropdownItems: categoryNav['power-solutions'].map(item => ({ name: item.name, href: `/power-solutions/${item.slug}` }))
  },
  { 
    name: 'Solar Panel', 
    href: '/solar-solutions',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Solar On-Grid Inverters', href: '/solar-solutions/solar-on-grid-inverters' },
      { name: 'Solar Off-Grid Inverters', href: '/solar-solutions/solar-off-grid-inverters' },
      { name: 'Solar Hybrid Inverters', href: '/solar-solutions/solar-hybrid-inverters' },
      { name: 'Solar Panels', href: '/solar-solutions/solar-panels' },
      { name: 'Solar Batteries', href: '/solar-solutions/solar-batteries' },
      { name: 'Solar Charge Controllers', href: '/solar-solutions/solar-charge-controllers' },
    ]
  },
  { 
    name: 'Brands', 
    href: '/categories',
    hasDropdown: true,
    dropdownItems: categoryNav['brands'].map(item => ({ name: item.name, href: `/brands/${item.slug}` }))
  },
  { name: 'About Us', href: '/about-us' },
  { name: 'Knowledge Hub', href: '/blog' },
  { name: 'SEO Report', href: '/seo-report' },
  { name: 'Contact Us', href: '/contact' }
];
