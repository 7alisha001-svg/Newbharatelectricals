const fs = require('fs');

let content = fs.readFileSync('package.json', 'utf8');
let pkg = JSON.parse(content);

// Move @supabase/supabase-js to dependencies
if (pkg.devDependencies['@supabase/supabase-js']) {
  pkg.dependencies['@supabase/supabase-js'] = pkg.devDependencies['@supabase/supabase-js'];
  delete pkg.devDependencies['@supabase/supabase-js'];
}

// Remove swiper
delete pkg.dependencies['swiper'];
delete pkg.devDependencies['swiper'];

// Remove cheerio
delete pkg.dependencies['cheerio'];
delete pkg.devDependencies['cheerio'];

// Move @types/nodemailer to devDependencies
if (pkg.dependencies['@types/nodemailer']) {
  pkg.devDependencies['@types/nodemailer'] = pkg.dependencies['@types/nodemailer'];
  delete pkg.dependencies['@types/nodemailer'];
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
