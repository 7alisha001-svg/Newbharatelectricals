const fs = require('fs');

const path = 'src/pages/GenericCategoryPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add imports
if (!content.includes("import { categoryNav } from '../data/navigation';")) {
  content = content.replace("import { formatSlugToTitle } from '../utils/formatters';", "import { formatSlugToTitle } from '../utils/formatters';\nimport { categoryNav } from '../data/navigation';\nimport { subcategoryDataMap } from '../data/products';");
}

const targetLogic = `  // Dynamic logic to figure out subcategories for this category to render placeholder grid
  let subcategories: { name: string; slug: string; desc: string; icon: any; imageUrl?: string }[] = [];

  const getIcon = (slug: string) => {
    if (slug.includes('battery') || slug.includes('batteries')) return <BatteryCharging size={24} />;
    if (slug.includes('solar') || slug.includes('panel')) return <Sun size={24} />;
    if (slug.includes('charge') || slug.includes('controller') || slug.includes('wiring') || slug.includes('cable') || slug.includes('power') || slug.includes('ups') || slug.includes('inverter') || slug.includes('combo')) return <Zap size={24} />;
    return <Microchip size={24} />;
  };

  const currentNav = categoryNav[category as string];
  if (currentNav) {
    subcategories = currentNav.map(navItem => {
      const data = subcategoryDataMap[navItem.slug];
      return {
        name: navItem.name,
        slug: navItem.slug,
        desc: data ? data.description : 'Explore our premium products.',
        icon: getIcon(navItem.slug),
        imageUrl: data && data.products && data.products.length > 0 ? data.products[0].imageUrl : (data?.bannerImage || 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop')
      };
    });
  }`;

const oldLogicRegex = /  \/\/ Dynamic logic to figure out subcategories for this category to render placeholder grid\s+let subcategories: \{ name: string; slug: string; desc: string; icon: any; imageUrl\?: string \}.*?\];\s+\}/s;

content = content.replace(oldLogicRegex, targetLogic);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated Category logic.");
