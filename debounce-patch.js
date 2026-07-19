const fs = require('fs');

let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

if (!content.includes('let fetchTimeout: NodeJS.Timeout;')) {
  content = content.replace(
    'const fetchData = async () => {',
    `let fetchTimeout: NodeJS.Timeout;
  const debouncedFetchData = () => {
    if (fetchTimeout) clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(fetchData, 1000);
  };
  const fetchData = async () => {`
  );

  content = content.replace(
    /fetchData\(\); \/\/ Simplest way to ensure fully fresh data/g,
    'debouncedFetchData();'
  );
  content = content.replace(
    /fetchData\(\);/g,
    `debouncedFetchData();`
  );
  // Revert the initial fetchData() in useEffect to immediate fetchData()
  content = content.replace(
    `useEffect(() => {
    debouncedFetchData();`,
    `useEffect(() => {
    fetchData();`
  );
  // Revert the value={{ ... refreshStore: debouncedFetchData }} to fetchData
  content = content.replace(
    `refreshStore: debouncedFetchData`,
    `refreshStore: fetchData`
  );

  fs.writeFileSync('src/context/StoreContext.tsx', content);
}
