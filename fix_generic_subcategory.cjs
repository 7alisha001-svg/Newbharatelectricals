const fs = require('fs');

let code = fs.readFileSync('src/pages/GenericSubCategoryPage.tsx', 'utf8');

// replace imports
code = code.replace(
  "import { subcategoryDataMap } from '../data/products';",
  "import { useStore } from '../context/StoreContext';"
);

// replace hook logic
const findString = `  const { category, subcategory } = useParams<{ category: string, subcategory: string }>();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const categoryTitle = formatSlugToTitle(category);

  // Fallback data in case the slug doesn't match perfectly
  const defaultSubCategoryTitle = formatSlugToTitle(subcategory);
  const data = subcategory ? subcategoryDataMap[subcategory] : null;

  const title = data ? data.title : defaultSubCategoryTitle;
  const description = data ? data.description : \`Discover our premium line of \${defaultSubCategoryTitle.toLowerCase()}. Engineered for superior performance and unmatched reliability in every condition.\`;
  const bannerImage = data ? data.bannerImage : 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2500&auto=format&fit=crop';
  const products = data ? data.products : [];`;

const replaceString = `  const { category, subcategory } = useParams<{ category: string, subcategory: string }>();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { products: storeProducts, loading } = useStore();
  
  const categoryTitle = formatSlugToTitle(category);
  const defaultSubCategoryTitle = formatSlugToTitle(subcategory);
  const title = defaultSubCategoryTitle;
  
  const description = \`Discover our premium line of \${defaultSubCategoryTitle.toLowerCase()}. Engineered for superior performance and unmatched reliability in every condition.\`;
  
  // Find products matching this subcategory (slug matching)
  const products = storeProducts.filter(p => p.slug === subcategory || p.category?.toLowerCase().replace(/\\s+/g, '-') === category?.toLowerCase().replace(/\\s+/g, '-'));
`;

code = code.replace(findString, replaceString);

// fix product images and keys inside the loop
code = code.replace(/product\.imageUrl/g, 'product.image_url');

fs.writeFileSync('src/pages/GenericSubCategoryPage.tsx', code);
