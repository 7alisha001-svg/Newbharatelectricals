const fs = require('fs');
['public/header-logo-dark.png', 'public/footer-logo-light.png', 'public/favicon.ico', 'public/android-chrome-192x192.png'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.startsWith('data:image')) {
    let base64 = content.split(',')[1];
    fs.writeFileSync(file, Buffer.from(base64, 'base64'));
    console.log('Fixed', file);
  }
});
