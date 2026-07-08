const matchCategory = (prodCat, urlSubCat) => {
  if (!prodCat || !urlSubCat) return false;
  const c1 = prodCat.toLowerCase().replace(/[^a-z0-9]/g, '');
  const c2 = urlSubCat.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s1 = c1.endsWith('s') ? c1.slice(0, -1) : c1;
  const s2 = c2.endsWith('s') ? c2.slice(0, -1) : c2;
  console.log({c1, c2, s1, s2});
  return s1 === s2 || s1.includes(s2) || s2.includes(s1);
};
console.log(matchCategory('Home inverters', 'inverters'));
console.log(matchCategory('Home inverters', 'inverter'));
