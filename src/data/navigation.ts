export const categoryNav: Record<string, {name: string, slug: string}[]> = {
  'power-solutions': [
    { name: 'Inverters', slug: 'inverters' },
    { name: 'Batteries', slug: 'batteries' },
    { name: '3-Phase Inverters', slug: '3-phase-inverters' },
    { name: 'Lift Inverters', slug: 'lift-inverters' },
    { name: 'Combo Products', slug: 'combo-products' },
  ],
  'solar-solutions': [
    { name: 'Solar On-Grid Inverters', slug: 'solar-on-grid-inverters' },
    { name: 'Solar Off-Grid Inverters', slug: 'solar-off-grid-inverters' },
    { name: 'Solar Hybrid Inverters', slug: 'solar-hybrid-inverters' },
    { name: 'Solar Panels', slug: 'solar-panels' },
    { name: 'Solar Batteries', slug: 'solar-batteries' },
    { name: 'Solar Charge Controllers', slug: 'solar-charge-controllers' },
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
  { name: 'Brands', href: '/brands' },
  { name: 'Categories', href: '/categories' },
  { name: 'Accessories', href: '/accessories' },
  { name: 'Store Locator', href: '/store-locator' },
  { name: 'Contact Us', href: '/contact' }
];
