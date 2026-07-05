const fs = require('fs');
const path = 'src/data/navigation.ts';
let content = fs.readFileSync(path, 'utf8');

const mobilityNav = `  'mobility-solutions': [
    { name: 'E-Rickshaw Batteries', slug: 'e-rickshaw-batteries' },
    { name: 'EV Battery Solutions', slug: 'ev-battery-solutions' },
    { name: 'Charging Support', slug: 'charging-support' },
    { name: 'Automotive Battery Solutions', slug: 'automotive-battery-solutions' },
  ],`;

if (!content.includes("'mobility-solutions':")) {
  content = content.replace("export const categoryNav: Record<string, {name: string, slug: string}[]> = {\n", "export const categoryNav: Record<string, {name: string, slug: string}[]> = {\n" + mobilityNav + "\n");
  fs.writeFileSync(path, content, 'utf8');
}
