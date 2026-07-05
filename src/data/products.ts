export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  imageUrl: string;
}

export interface SubCategoryData {
  title: string;
  description: string;
  bannerImage: string;
  products: Product[];
  benefits: string[];
}

export const subcategoryDataMap: Record<string, SubCategoryData> = {
  // Power Solutions
  'inverters': {
    title: 'Inverters',
    description: 'Explore our wide range of digital and pure sine wave inverters for homes and businesses.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'an-star-11075', name: 'AN STAR 11075', description: '10 KVA Pure Sine Wave Digital Inverter designed to deliver reliable, uninterrupted power.', features: ['10 KVA / 120V Capacity', 'Pure Sine Wave Output', 'Intelligent LCD Display'], imageUrl: '/images/amaze-an-star-1475-1.jpg' },      { id: 'inv-1', name: '800VA Inverter', description: 'Compact and efficient inverter for small homes and essential load.', features: ['Digital Display', 'Low Noise', 'High Efficiency'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' },
      { id: 'inv-3', name: 'Pure Sine Wave Inverter', description: 'Provides grid-like power to ensure the highest safety for sensitive modern appliances.', features: ['Noiseless Operation', 'Extended Appliance Life', 'LED Indicators'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Silent Operation', 'Safe for Sensitive Electronics', 'Quick Recharge']
  },
  'batteries': {
    title: 'Batteries',
    description: 'High-performance tubular and flat plate batteries for long-lasting backup.',
    bannerImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'bat-1', name: 'Tall Tubular Battery', description: 'Superior backup time and long life.', features: ['Low Maintenance', 'Deep Cycle Design'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Long Life', 'Fast Charging', 'Low Maintenance']
  },
  '3-phase-inverters': {
    title: '3-Phase Inverters',
    description: 'Heavy duty 3-phase inverters for industrial and commercial use.',
    bannerImage: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: '3pi-1', name: '15KVA 3-Phase Inverter', description: 'Industrial grade 3-phase inverter.', features: ['DSP Based', 'High Efficiency'], imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Industrial Grade', 'High Efficiency', 'Robust Design']
  },
  'lift-inverters': {
    title: 'Lift Inverters',
    description: 'Specialized backup solutions for elevators and heavy motors.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'li-1', name: 'Lift UPS 6KVA', description: 'Reliable backup for passenger elevators.', features: ['ARD Compatible', 'High Surge Capacity'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['High Surge Capacity', 'Safe Operation', 'Reliable Backup']
  },
  'combo-products': {
    title: 'Combo Products',
    description: 'Ready-to-use inverter and battery combo packages for hassle-free installation.',
    bannerImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'combo-1', name: 'Home Combo 1KVA', description: 'Complete power backup solution for small homes.', features: ['Inverter + Battery', 'Free Installation'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Cost Effective', 'Perfect Match', 'Easy Setup']
  },
  'ups-systems': {
    title: 'UPS Systems',
    description: 'High reliability UPS for critical loads and uninterrupted power supply.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'ups-1', name: 'Home UPS 900VA', description: 'Perfect for basic home backup requirements covering lights and fans.', features: ['Pure Sine Wave', 'Fast Charging', 'Overload Protection'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'ups-2', name: 'Office UPS 1500VA', description: 'Robust power backup for office computers, servers, and sensitive electronics.', features: ['Extended Backup', 'Smart Battery Management', 'Surge Protection'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'ups-3', name: 'Smart Backup UPS', description: 'Advanced connected UPS with mobile monitoring and predictive maintenance.', features: ['Wi-Fi Enabled', 'App Control', 'Auto Shutdown'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Zero Switchover Time', 'Prevents Data Loss', 'Long Battery Life']
  },
  'home-inverters': {
    title: 'Home Inverters',
    description: 'Keep your home powered during outages with our reliable home inverters.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'an-star-11075', name: 'AN STAR 11075', description: '10 KVA Pure Sine Wave Digital Inverter designed to deliver reliable, uninterrupted power.', features: ['10 KVA / 120V Capacity', 'Pure Sine Wave Output', 'Intelligent LCD Display'], imageUrl: '/images/amaze-an-star-1475-1.jpg' },
      { id: 'inv-1', name: '800VA Inverter', description: 'Compact and efficient inverter for small homes and essential load.', features: ['Digital Display', 'Low Noise', 'High Efficiency'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' },
      { id: 'inv-2', name: '1100VA Inverter', description: 'Standard capacity inverter for typical 2-3 BHK homes.', features: ['Fast Battery Charge', 'Safe for Appliances', 'Compact Design'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' },
      { id: 'inv-3', name: 'Pure Sine Wave Inverter', description: 'Provides grid-like power to ensure the highest safety for sensitive modern appliances.', features: ['Noiseless Operation', 'Extended Appliance Life', 'LED Indicators'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Silent Operation', 'Safe for Sensitive Electronics', 'Quick Recharge']
  },
  'industrial-inverters': {
    title: 'Industrial Inverters',
    description: 'Heavy duty inverters designed for commercial establishments and large scale operations.',
    bannerImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'an-star-11075', name: 'AN STAR 11075', description: '10 KVA Pure Sine Wave Digital Inverter designed to deliver reliable, uninterrupted power for commercial and industrial applications.', features: ['10 KVA / 120V Capacity', 'Pure Sine Wave Output', 'Intelligent LCD Display'], imageUrl: '/images/amaze-an-star-1475-1.jpg' },
      { id: 'ind-1', name: 'Heavy-Duty Inverter', description: 'Handles large inductive loads like motors, pumps, and heavy machinery.', features: ['DSP Based Control', 'High Overload Capability', 'Rugged Build'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'ind-2', name: 'Commercial Backup Inverter', description: 'Ideal for shopping malls, hospitals, and educational institutions.', features: ['3-Phase Output', 'LCD Monitoring Panel', 'Modular Design'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Industrial Grade Components', 'High Load Capacity', '24/7 Reliability']
  },
  'battery-backup-systems': {
    title: 'Battery Backup Systems',
    description: 'Long-lasting power storage solutions built to survive deep discharge cycles.',
    bannerImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'bat-1', name: 'Tubular Batteries', description: 'Tall tubular batteries offering superior backup time and long life.', features: ['Low Maintenance', 'Deep Cycle Design', 'High Acid Volume'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
      { id: 'bat-2', name: 'Backup Batteries', description: 'Standard flat plate batteries for optimized short-term high current backup.', features: ['Fast Recharge', 'Spill-proof design', 'Compact Size'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
      { id: 'bat-3', name: 'Long-Life Batteries', description: 'Premium batteries engineered for extreme temperatures and extended lifespan.', features: ['Extra Thick Plates', 'Factory Charged', 'Corrosion Resistant'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Extended Backup Time', 'Low Maintenance', 'Heavy Duty Performance']
  },
  'power-backup-solutions': {
    title: 'Power Backup Solutions',
    description: 'Comprehensive blackout protection for uninterrupted business and life.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'pbs-1', name: 'Complete Home Combo', description: 'Inverter + Tubular Battery paired for optimized performance.', features: ['Pre-configured combo', 'Free Installation', 'Extended Warranty'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' },
      { id: 'pbs-2', name: 'Business Power Setup', description: 'Rack-mounted commercial grade backup solutions.', features: ['High Capacity Range', 'Rack Mountable', 'Scalable Storage'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Turnkey Solutions', 'Expert Installation', 'Seamless Integration']
  },

  // Solar Solutions
  'solar-on-grid-inverters': {
    title: 'Solar On-Grid Inverters',
    description: 'Grid-tied inverters for maximum savings and net metering.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'sgi-1', name: '5KW On-Grid Inverter', description: 'High-efficiency grid-tied inverter.', features: ['98% Efficiency', 'Wi-Fi Monitoring', 'Compact Design'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
      { id: 'sgi-2', name: '10KW 3-Phase On-Grid', description: 'Commercial grade grid-tied inverter.', features: ['3-Phase Output', 'Dual MPPT', 'IP65 Rated'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Lower Electricity Bills', 'Grid Exporting', 'Maintenance Free']
  },
  'solar-off-grid-inverters': {
    title: 'Solar Off-Grid Inverters',
    description: 'Independent power generation for remote locations and complete backup.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'soi-1', name: '3KW Off-Grid Inverter', description: 'Reliable off-grid inverter for home use.', features: ['Pure Sine Wave', 'Built-in Charge Controller', 'Battery Prioritization'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Energy Independence', 'Reliable Backup', 'Works Without Grid']
  },
  'solar-hybrid-inverters': {
    title: 'Solar Hybrid Inverters',
    description: 'Intelligent systems balancing grid, solar, and battery for optimal performance.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'shi-1', name: 'Hybrid Inverter 5KW', description: 'Intelligently manages power from solar, grid, and batteries simultaneously.', features: ['Grid-Export Feature', 'Battery Prioritization', 'LCD Touch Panel'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Maximum Flexibility', 'Smart Grid Management', 'Seamless Switchover']
  },
  'solar-panels': {
    title: 'Solar Panels',
    description: 'High-efficiency monocrystalline and polycrystalline panels.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'sp-1', name: '330W Poly Panel', description: 'Durable polycrystalline solar panel.', features: ['Cost Effective', 'High Yield', 'Weather Resistant'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
      { id: 'sp-2', name: '540W Mono PERC Half-Cut', description: 'Premium ultra-high efficiency monocrystalline panel.', features: ['Half-Cut Tech', 'Better Shading Tolerance', '25-Year Warranty'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Maximum Power Generation', 'Durable Construction', 'High ROI']
  },
  'solar-batteries': {
    title: 'Solar Batteries',
    description: 'Store excess solar energy during the day for reliable night-time use.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'sb-1', name: 'Lithium Battery Pack', description: 'Modern, high-density energy storage with ultra-long cycle life.', features: ['Lightweight', '10+ Years Life', 'BMS Integrated'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
      { id: 'sb-2', name: 'Solar Tubular Battery', description: 'Specially designed deep-cycle tubular batteries for solar charging profiles.', features: ['C10 Rating', 'Low Water Topping', 'Handles Partial State of Charge'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Energy Security', 'Night-time Load Running', 'Long Lifespan']
  },
  'solar-charge-controllers': {
    title: 'Solar Charge Controllers',
    description: 'MPPT and PWM controllers for optimal charging of your solar battery bank.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'scc-1', name: '40A MPPT Controller', description: 'High-efficiency MPPT charge controller.', features: ['99% Tracking Efficiency', 'LCD Display', 'Multi-stage Charging'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Maximize Battery Life', 'High Efficiency Tracking', 'Safe Charging']
  },
  'residential-solar-panels': {
    title: 'Residential Solar Panels',
    description: 'Harness the sun for your home and dramatically reduce your electricity bills.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'rsp-1', name: '1KW Solar Panel System', description: 'Entry-level solar package ideal for small homes reducing grid-dependency.', features: ['High Efficiency Mono-PERC', 'Space Saving', 'Weather Resistant'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
      { id: 'rsp-2', name: '2KW Rooftop System', description: 'The most popular choice for average size households.', features: ['Subsidy Eligible', 'Net-Meter Ready', '25-Year Warranty'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
      { id: 'rsp-3', name: '3KW Home Solar setup', description: 'Run air conditioners and heavy appliances exclusively on solar power.', features: ['Maximum Yield', 'Smart Energy Metering', 'Heavy Load Support'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Lower Electricity Bills', 'Increase Property Value', 'Clean Energy Generation']
  },
  'commercial-solar-panels': {
    title: 'Commercial Solar Panels',
    description: 'Accelerate your business sustainability goals while cutting operational costs.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'csp-1', name: '5KW Solar System', description: 'Perfect for small offices, clinics, and retail stores.', features: ['Optimal ROI', 'Commercial Grade Inverter', 'Tier-1 Panels'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
      { id: 'csp-2', name: '10KW Business Solar', description: 'Comprehensive grid-tied solar setup for high energy-consuming businesses.', features: ['High Conversion Efficiency', 'Remote Plant Monitoring', 'Tax Depreciation Benefits'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Tax Benefits', 'Brand Value Enhancement', 'Fixed Energy Costs']
  },
  'industrial-solar-projects': {
    title: 'Industrial Solar Projects',
    description: 'Large scale solar deployments designed for manufacturing facilities and warehouses.',
    bannerImage: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'isp-1', name: 'Factory Rooftop Solar', description: 'Custom engineered mega-watt scale solar plants for factories.', features: ['Custom EPC Operations', 'High Tensile Structure', 'O&M Services'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
      { id: 'isp-2', name: 'Warehouse Solar Setup', description: 'Maximize massive unused roof space with light-weight solar installations.', features: ['Non-penetrating Mounts', 'Distributed Inverters', 'High Yield'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Massive Cost Savings', 'Energy Independence', 'Corporate Social Responsibility']
  },
  'solar-inverters': {
    title: 'Solar Inverters',
    description: 'Efficient DC to AC conversion tailored for maximum solar yield.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'si-1', name: 'Hybrid Inverter', description: 'Intelligently manages power from solar, grid, and batteries simultaneously.', features: ['Grid-Export Feature', 'Battery Prioritization', 'LCD Touch Panel'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' },
      { id: 'si-2', name: 'Solar PCU (Inverter)', description: 'Dedicated Power Conditioning Unit optimized for off-grid operations.', features: ['MPPT Technology', 'High Efficiency', 'Rugged Design'], imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Maximum Power Point Tracking', 'High Conversion Rate', 'Smart Grid Management']
  },
  'solar-battery-storage': {
    title: 'Solar Battery Storage',
    description: 'Store excess solar energy during the day for reliable night-time use.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'sbs-1', name: 'Lithium Battery Pack', description: 'Modern, high-density energy storage with ultra-long cycle life.', features: ['Lightweight', '10+ Years Life', 'BMS Integrated'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
      { id: 'sbs-2', name: 'Solar Tubular Battery', description: 'Specially designed deep-cycle tubular batteries for solar charging profiles.', features: ['C10 Rating', 'Low Water Topping', 'Handles Partial State of Charge'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Energy Security', 'Night-time Load Running', 'Long Lifespan']
  },
  'rooftop-solar-solutions': {
    title: 'Rooftop Solar Solutions',
    description: 'Turn your idle roof into a clean power generating asset.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'rts-1', name: 'Residential Rooftop Plant', description: 'Aesthetic, compact rooftop installations tailored for home architecture.', features: ['Custom Design', 'Aesthetic Mounting', 'Weatherproof'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' },
      { id: 'rts-2', name: 'Commercial Rooftop Plant', description: 'Optimized array designs for maximum yield on flat commercial roofs.', features: ['Ballasted Mounts', 'Walkway Integration', 'High Wind Resistance'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Space Utilization', 'Cooler Roof Temperatures', 'Scalable Capacity']
  },
  'solar-installation-services': {
    title: 'Solar Installation Services',
    description: 'Professional mounting, wiring, and commissioning by certified engineers.',
    bannerImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'srv-1', name: 'End-to-End Installation', description: 'From site survey to net-meter commissioning, we handle it all.', features: ['Site Audit', 'Structural Engineering', 'Grid Approvals'], imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop' },
      { id: 'srv-2', name: 'AMC & Support', description: 'Annual maintenance contracts to keep your solar plant running optimally.', features: ['Panel Cleaning', 'System Health Check', 'Priority Support'], imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Expert Execution', 'Safety Standards Followed', 'Hassle-free Permitting']
  },

  // Mobility Solutions
  'e-rickshaw-batteries': {
    title: 'E-Rickshaw Batteries',
    description: 'Durable and high-mileage batteries for daily transit applications.',
    bannerImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'erb-1', name: 'E-Rickshaw Heavy Model', description: 'Specially engineered deep cycle batteries yielding more mileage per charge.', features: ['High Density Lead', 'Vibration Resistant', 'Quick Charge Acceptance'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
      { id: 'erb-2', name: 'E-Rickshaw Long Range', description: 'Premium tier batteries for drivers needing extended operating hours.', features: ['Extra Mileage', 'Corrosion Resistant', 'Rugged Container'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['More Kilometers per Charge', 'Vibration Resistance', 'Long Cycle Life']
  },
  'ev-battery-solutions': {
    title: 'EV Battery Solutions',
    description: 'Next-generation EV power cells for electric two and three-wheelers.',
    bannerImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'evb-1', name: 'Li-ion EV Battery', description: 'Lightweight lithium-ion packs for electric scooters and bikes.', features: ['Smart BMS', 'Thermal Management', 'Fast Charging'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
      { id: 'evb-2', name: 'LFP EV Battery', description: 'Ultra-safe Lithium Iron Phosphate batteries with extremely long life cycles.', features: ['High Thermal Stability', 'Drop-in Replacement', '2000+ Cycles'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['High Power Density', 'Fast Charging Capabilities', 'Advanced Safety']
  },
  'charging-support': {
    title: 'Charging Support',
    description: 'Fast and reliable charging networks and private station setups.',
    bannerImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'chg-1', name: 'Home EV Charger', description: 'Wall-mounted AC chargers for safe overnight charging of your EV.', features: ['IP65 Rated', 'App Connectivity', 'Surge Protection'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'chg-2', name: 'Industrial EV Charger', description: 'DC Fast charging stations for commercial fleets and parking lots.', features: ['Multi-Gun Setup', 'RFID Integration', 'High Output Rating'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'chg-3', name: 'Electrical Connectors', description: 'High-amperage plugs and sockets for secure EV charging connections.', features: ['Heat Resistant', 'Industrial Grade', 'Universal Fit'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Safe Charging', 'Fast Speeds', 'Smart Load Balancing']
  },
  'automotive-battery-solutions': {
    title: 'Automotive Battery Solutions',
    description: 'Start your vehicle with confidence every single time.',
    bannerImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'aut-1', name: 'Car Battery Platinum', description: 'Maintenance-free highly durable car batteries for modern vehicles.', features: ['High Cranking Amps', 'Spill-Proof', 'Vibration Resistant'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' },
      { id: 'aut-2', name: 'Bike/2-Wheeler Battery', description: 'VRLA technology batteries offering instant start for motorcycles.', features: ['Factory Activated', 'Sealed Maintenance Free', 'Compact Fit'], imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['All-Weather Starting', 'Maintenance Free', 'Extended Warranty']
  },

  // Accessories
  'solar-connectors': {
    title: 'Solar Connectors',
    description: 'MC4 and weatherproof connectors for safe and efficient solar power transmission.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'acc-1', name: 'MC4 Connectors', description: 'Standard high-quality IP67 rated connectors for solar panels.', features: ['UV Resistant', 'Waterproof', 'Snap-in Lock'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'acc-2', name: 'Branch Cable Kits', description: 'Y-branch connectors for parallel wiring of solar panels.', features: ['Low Contact Resistance', 'Flame Retardant', 'High Current Rating'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Weatherproof Connections', 'Minimal Power Loss', 'Easy Assembly']
  },
  'wiring-accessories': {
    title: 'Wiring Accessories',
    description: 'High-quality copper structured wiring components and fixtures.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'acc-3', name: 'House Wiring Kits', description: 'Complete bundles of pure copper FR-grade wires for domestic use.', features: ['Fire Retardant', '99.9% Pure Copper', 'High Insulation'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'acc-4', name: 'Crimp Connectors & Lugs', description: 'Heavy-duty copper lugs for secure terminal connections.', features: ['Tin Plated', 'High Conductivity', 'Various Sizes'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Fire Safety', 'High Efficiency', 'Long Lasting']
  },
  'electrical-cables': {
    title: 'Electrical Cables',
    description: 'Industrial grade insulated cables for transmitting high loads.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'acc-5', name: 'Commercial Power Cables', description: 'Armoured multi-core cables for underground or heavy industrial wiring.', features: ['Armoured Protection', 'XLPE Insulated', 'High Capacity'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'acc-6', name: 'DC Solar Cable', description: 'Specially constructed UV resistant cables for solar array DC transmission.', features: ['Double Insulated', 'UV & Ozone Resistant', 'Tinned Copper'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Durable Outer Jacket', 'High Grade Insulation', 'Flexible']
  },
  'switches': {
    title: 'Switches & Switchgears',
    description: 'Modern, durable, and safe switches for home and industrial applications.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'acc-7', name: 'Main Distribution Switches', description: 'Heavy duty changeover and main switches for incoming power control.', features: ['Arc Shielding', 'Sturdy Enclosure', 'High Breaking Capacity'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'acc-8', name: 'Safety Switches (MCB/RCCB)', description: 'Essential circuit breakers to protect against overload and earth leakage.', features: ['Quick Trip Mechanism', 'DIN Rail Mountable', 'Finger-proof Terminals'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Electrical Safety', 'Ergonomic Design', 'High Durability']
  },
  'installation-accessories': {
    title: 'Installation Accessories',
    description: 'Mounts, brackets, and rails essential for setting up systems.',
    bannerImage: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'acc-9', name: 'Solar Mounting Structures', description: 'Galvanized iron and aluminum rails for securing solar panels.', features: ['Rust Proof', 'Wind Resistant', 'Pre-drilled Holes'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Structural Integrity', 'Rust Resistance', 'Easy Assembly']
  },
  'battery-accessories': {
    title: 'Battery Accessories',
    description: 'Terminals, water level indicators, and racks for battery maintenance.',
    bannerImage: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=2500&auto=format&fit=crop',
    products: [
      { id: 'acc-10', name: 'Heavy Duty Trolleys', description: 'Sturdy plastic and metal trolleys to house inverter and battery.', features: ['Caster Wheels', 'Ventilated Design', 'Space Saving'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'acc-11', name: 'Battery Water Indicators', description: 'Floats to easily monitor distilled water levels in tubular batteries.', features: ['Clear Visibility', 'Acid Resistant', 'Universal Fit'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' },
      { id: 'acc-12', name: 'Battery Connectors', description: 'Lead and brass terminal connectors for batteries.', features: ['Corrosion Resistant Lead', 'High Conductivity', 'Secure Fit'], imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop' }
    ],
    benefits: ['Easy Maintenance', 'Safe Storage', 'Prolonged Battery Life']
  }
};
