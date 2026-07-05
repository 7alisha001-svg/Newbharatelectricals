const fs = require('fs');

const path = 'src/data/products.ts';
let content = fs.readFileSync(path, 'utf8');

const newCats = `
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
  },`;

if (!content.includes("'3-phase-inverters': {")) {
  content = content.replace(/('inverters': \{[\s\S]*?},\n)/, "$1" + newCats);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Added new categories.");
} else {
  console.log("Already added.");
}
