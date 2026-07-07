const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// The one inside useEffect starts at "const fetchData = async () => {" 
// and ends at "    fetchData();\n\n    // Setup Realtime subscriptions"
// Let's remove it.
const badString = `    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, brandRes, prodRes, settingsRes] = await Promise.all([
          supabase.from('categories').select('*').order('name', { ascending: true }),
          supabase.from('brands').select('*').order('name', { ascending: true }),
          supabase.from('products').select('*').eq('status', 'publish').order('created_at', { ascending: false }),
          supabase.from('settings').select('*').eq('id', 'global').single(),
        ]);

        if (catRes.data) setCategories(catRes.data);
        if (brandRes.data) setBrands(brandRes.data);
        if (prodRes.data) setProducts(prodRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();`;

code = code.replace(badString, "");
fs.writeFileSync('src/context/StoreContext.tsx', code);
